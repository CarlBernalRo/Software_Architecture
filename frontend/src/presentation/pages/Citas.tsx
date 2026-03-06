import React, { useEffect, useState } from 'react';
import { CalendarCheck, User, Calendar, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useCitas } from '../../application/hooks/useCitas';
import { useMedicos } from '../../application/hooks/useMedicos';
import { usePacientes } from '../../application/hooks/usePacientes';

export const Citas: React.FC = () => {
    const { citas, loading, fetchCitas, agendarCita, cancelarCita } = useCitas();
    const { medicos, fetchMedicos } = useMedicos();
    const { pacientes, fetchPacientes } = usePacientes();

    const [showForm, setShowForm] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'activa' | 'pasada'>('activa');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'error' | 'success' });
    const [formData, setFormData] = useState({
        pacienteId: '',
        medicoId: '',
        fechaHora: ''
    });

    useEffect(() => {
        fetchCitas();
        fetchMedicos();
        fetchPacientes();
    }, [fetchCitas, fetchMedicos, fetchPacientes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await agendarCita({
                pacienteId: parseInt(formData.pacienteId),
                medicoId: parseInt(formData.medicoId),
                fechaHora: formData.fechaHora
            });
            setShowForm(false);
            setFormData({ pacienteId: '', medicoId: '', fechaHora: '' });
            setModalConfig({ isOpen: true, title: 'Éxito', message: 'Cita agendada correctamente', type: 'success' });
        } catch (err: any) {
            setModalConfig({ isOpen: true, title: 'Error', message: err.message, type: 'error' });
        }
    };

    const formatearFecha = (fechaISO: string) => {
        try {
            const date = new Date(fechaISO);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' +
                date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return fechaISO;
        }
    };

    const citasFiltradas = citas.filter(cita => {
        const fechaCita = new Date(cita.fechaHora);
        const ahora = new Date();
        
        if (statusFilter === 'activa') {
            return (fechaCita >= ahora || (fechaCita.toDateString() === ahora.toDateString())) && cita.estado !== 'CANCELADA';
        } else {
            return fechaCita < ahora || cita.estado === 'CANCELADA';
        }
    }).sort((a, b) => {
        const dateA = new Date(a.fechaHora).getTime();
        const dateB = new Date(b.fechaHora).getTime();
        return statusFilter === 'activa' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="flex-1 pb-24">
            {/* Header Area */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 justify-between">
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
                    {showForm ? 'Agendar Cita' : 'Gestión de Citas'}
                </h2>
                <button
                    className={`btn px-4 py-1.5 rounded-xl font-bold text-sm ${showForm ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-primary text-white'}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Volver' : 'Nueva Cita'}
                </button>
            </div>

            {showForm ? (
                /* Agendar Cita View */
                <div className="max-w-xl mx-auto px-4 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-6">
                        {/* 1. Patient Selection */}
                        <div className="space-y-3">
                            <h3 className="text-slate-900 dark:text-slate-100 text-base font-semibold text-left">1. Información del Paciente</h3>
                            <div className="relative">
                                <select
                                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                                    value={formData.pacienteId}
                                    onChange={e => setFormData({ ...formData, pacienteId: e.target.value })}
                                >
                                    <option value="">Seleccionar Paciente</option>
                                    {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} (ID: {p.documento})</option>)}
                                </select>
                            </div>
                        </div>

                        {/* 2. Doctor Selection */}
                        <div className="space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <h3 className="text-slate-900 dark:text-slate-100 text-base font-semibold text-left">2. Especialista</h3>
                            <div className="relative">
                                <select
                                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                                    value={formData.medicoId}
                                    onChange={e => setFormData({ ...formData, medicoId: e.target.value })}
                                >
                                    <option value="">Seleccionar Médico</option>
                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre} - {m.especialidad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 3. Date & Time Selection */}
                        <div className="space-y-3">
                            <h3 className="text-slate-900 dark:text-slate-100 text-base font-semibold text-left">3. Fecha y Hora</h3>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <input
                                    type="datetime-local"
                                    className="w-full h-12 px-4 rounded-xl border-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary"
                                    value={formData.fechaHora}
                                    onChange={e => setFormData({ ...formData, fechaHora: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.pacienteId || !formData.medicoId || !formData.fechaHora}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <CalendarCheck className="size-5" />
                                Agendar Registro
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Gestión de Citas (List View) */
                <main className="px-4 py-6 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-slate-900 dark:text-slate-100 text-md font-bold leading-tight tracking-tight">
                            {statusFilter === 'activa' ? 'Próximas Citas' : 'Historial de Citas'}
                        </h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setStatusFilter('activa')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${statusFilter === 'activa' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}
                            >
                                Activas
                            </button>
                            <button 
                                onClick={() => setStatusFilter('pasada')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${statusFilter === 'pasada' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}
                            >
                                Pasadas
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-slate-500">Actualizando agenda...</div>
                    ) : citasFiltradas.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <Clock className="size-10 mx-auto mb-3 opacity-20" />
                            <p>No se encontraron citas {statusFilter === 'activa' ? 'activas' : 'pasadas'}.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {citasFiltradas.map(cita => (
                                <div key={cita.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 text-left">
                                    <div className="flex items-start gap-4">
                                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border-2 border-primary/5">
                                            <User className="size-8" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-900 dark:text-slate-100 text-base font-semibold mb-0">{cita.paciente?.nombre || 'Paciente #' + cita.pacienteId}</p>
                                            <p className="text-primary text-sm font-medium mb-1">{cita.medico?.nombre || 'Médico #' + cita.medicoId}</p>
                                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                <Calendar className="size-3" />
                                                <p className="text-xs">{formatearFecha(cita.fechaHora)}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center px-2 py-1 rounded ${cita.estado === 'CANCELADA' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${cita.estado === 'CANCELADA' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                                                {cita.estado}
                                            </span>
                                        </div>
                                    </div>

                                    {statusFilter === 'activa' && cita.estado !== 'CANCELADA' && (
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform"
                                                onClick={() => setModalConfig({ isOpen: true, title: 'Info', message: 'Reprogramación coming soon...', type: 'info' })}
                                            >
                                                Reprogramar
                                            </button>
                                            <button
                                                className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform"
                                                onClick={() => cancelarCita(cita.id!)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            )}

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </div>
    );
};
