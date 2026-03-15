import React, { useEffect, useState } from 'react';
import { CalendarCheck, User, Calendar, Clock } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useCitas } from '../../application/hooks/useCitas';
import { useMedicos } from '../../application/hooks/useMedicos';
import { usePacientes } from '../../application/hooks/usePacientes';

export const Citas: React.FC = () => {
    const { citas, loading, fetchCitas, agendarCita, cancelarCita, reprogramarCita } = useCitas();
    const { medicos, fetchMedicos } = useMedicos();
    const { pacientes, fetchPacientes } = usePacientes();

    const [showForm, setShowForm] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'ACTIVA' | 'COMPLETADA' | 'CANCELADA'>('ACTIVA');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'error' | 'success' | 'warning', onConfirm: undefined as (() => void) | undefined, confirmText: undefined as string | undefined, cancelText: undefined as string | undefined });
    const [formData, setFormData] = useState({
        pacienteId: '',
        medicoId: '',
        fecha: '',
        hora: ''
    });

    // Filtros de búsqueda
    const [searchTerm, setSearchTerm] = useState('');


    const [rescheduleData, setRescheduleData] = useState<{
        citaId: number | null,
        nuevoMedicoId: string,
        fecha: string,
        hora: string,
        fechaOriginal: string
    }>({
        citaId: null,
        nuevoMedicoId: '',
        fecha: '',
        hora: '',
        fechaOriginal: ''
    });

    const {
        disponibilidad,
        consultarDisponibilidad,
        loading: loadingDisponibilidad
    } = useCitas();

    useEffect(() => {
        if (formData.medicoId && formData.fecha) {
            consultarDisponibilidad(parseInt(formData.medicoId), formData.fecha);
        }
    }, [formData.medicoId, formData.fecha]);

    useEffect(() => {
        if (rescheduleData.nuevoMedicoId && rescheduleData.fecha) {
            consultarDisponibilidad(parseInt(rescheduleData.nuevoMedicoId), rescheduleData.fecha);
        }
    }, [rescheduleData.nuevoMedicoId, rescheduleData.fecha]);

    useEffect(() => {
        fetchCitas();
        fetchMedicos();
        fetchPacientes();
    }, [fetchCitas, fetchMedicos, fetchPacientes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { pacienteId, medicoId, fecha, hora } = formData;
        if (!pacienteId || !medicoId || !fecha || !hora) return;

        const fechaHora = `${fecha}T${hora}`;

        try {
            await agendarCita({
                pacienteId: parseInt(pacienteId),
                medicoId: parseInt(medicoId),
                fechaHora
            });
            setShowForm(false);
            setFormData({ pacienteId: '', medicoId: '', fecha: '', hora: '' });
            setModalConfig({ isOpen: true, title: 'Éxito', message: 'Cita agendada correctamente', type: 'success', onConfirm: undefined, confirmText: undefined, cancelText: undefined });
        } catch (err: any) {
            setModalConfig({ isOpen: true, title: 'Error', message: err.message, type: 'error', onConfirm: undefined, confirmText: undefined, cancelText: undefined });
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

    const formatHoraAMPM = (hora24: string) => {
        try {
            const [h, m] = hora24.split(':');
            let hours = parseInt(h, 10);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
        } catch {
            return hora24;
        }
    };

    const citasFiltradas = citas.filter(cita => {
        let matchesStatus = cita.estado === statusFilter;

        // Búsqueda por texto (paciente, médico o especialidad)
        const normalize = (text: string) => text ? text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
        const search = normalize(searchTerm);
        
        const pacienteNombre = normalize(cita.paciente?.nombre || '');
        const medicoNombre = normalize(cita.medico?.nombre || '');
        const medicoEspecialidad = normalize(cita.medico?.especialidad || '');

        const matchesSearch = searchTerm === '' || 
                              pacienteNombre.includes(search) || 
                              medicoNombre.includes(search) || 
                              medicoEspecialidad.includes(search);

        return matchesStatus && matchesSearch;
    }).sort((a, b) => {
        const dateA = new Date(a.fechaHora).getTime();
        const dateB = new Date(b.fechaHora).getTime();
        return statusFilter === 'ACTIVA' ? dateA - dateB : dateB - dateA;
    });

    // Handler para confirmar cancelación
    const handleConfirmCancel = async (id: number) => {
        try {
            await cancelarCita(id);
            setModalConfig({ 
                isOpen: true, 
                title: 'Cita Cancelada', 
                message: 'La cita ha sido cancelada exitosamente.', 
                type: 'success', 
                onConfirm: undefined, 
                confirmText: undefined, 
                cancelText: undefined 
            });
        } catch (err: any) {
            setModalConfig({ 
                isOpen: true, 
                title: 'Error', 
                message: err.message || 'No se pudo cancelar la cita', 
                type: 'error', 
                onConfirm: undefined, 
                confirmText: undefined, 
                cancelText: undefined 
            });
        } finally {
            // No longer using citaACancelar local state for the logic
        }
    };

    // Handler para abrir modal de cancelar
    const promptCancel = (id: number) => {
        setModalConfig({
            isOpen: true,
            title: '¿Confirmar Cancelación?',
            message: '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
            type: 'warning',
            onConfirm: () => handleConfirmCancel(id),
            confirmText: 'Sí, Cancelar',
            cancelText: 'No, Mantener'
        });
    };

    // Handler para enviar reprogramación
    const handleRescheduleSubmit = async () => {
        const { citaId, nuevoMedicoId, fecha, hora, fechaOriginal } = rescheduleData;
        if (!citaId || !nuevoMedicoId || !fecha || !hora) return;

        const nuevaFechaHora = `${fecha}T${hora}`;

        // Validaciones
        const newDate = new Date(nuevaFechaHora);
        const now = new Date();
        const originalDate = new Date(fechaOriginal);

        if (newDate <= now) {
            setModalConfig({ isOpen: true, title: 'Error', message: 'La nueva fecha/hora debe ser en el futuro.', type: 'error', onConfirm: undefined, confirmText: undefined, cancelText: undefined });
            return;
        }

        if (newDate.getTime() === originalDate.getTime()) {
            setModalConfig({ isOpen: true, title: 'Aviso', message: 'La nueva fecha debe ser diferente a la actual.', type: 'warning', onConfirm: undefined, confirmText: undefined, cancelText: undefined });
            return;
        }

        try {
            await reprogramarCita(citaId, nuevaFechaHora, parseInt(nuevoMedicoId));
            setRescheduleData({ citaId: null, nuevoMedicoId: '', fecha: '', hora: '', fechaOriginal: '' });
            setModalConfig({ isOpen: true, title: 'Éxito', message: 'Cita reprogramada correctamente', type: 'success', onConfirm: undefined, confirmText: undefined, cancelText: undefined });
        } catch(err: any) {
            setModalConfig({ isOpen: true, title: 'Error', message: err.message || 'No se pudo reprogramar la cita', type: 'error', onConfirm: undefined, confirmText: undefined, cancelText: undefined });
        }
    };

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

                        {/* 3. Date Selection */}
                        <div className="space-y-3">
                            <h3 className="text-slate-900 dark:text-slate-100 text-base font-semibold text-left">3. Fecha</h3>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <input
                                    type="date"
                                    className="w-full h-12 px-4 rounded-xl border-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.fecha}
                                    onChange={e => setFormData({ ...formData, fecha: e.target.value, hora: '' })}
                                />
                            </div>
                        </div>

                        {/* 4. Time Selection */}
                        <div className="space-y-3">
                            <h3 className="text-slate-900 dark:text-slate-100 text-base font-semibold text-left">4. Horarios Disponibles</h3>
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[140px] flex flex-col justify-center">
                                {loadingDisponibilidad ? (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm text-slate-500 font-medium tracking-wide font-sans">Buscando horarios...</p>
                                    </div>
                                ) : !formData.fecha || !formData.medicoId ? (
                                    <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
                                       <Clock className="size-6 mx-auto mb-2 text-slate-300" />
                                       <p className="text-sm text-slate-400 font-medium">Selecciona un médico y una fecha para ver disponibilidad</p>
                                    </div>
                                ) : disponibilidad.length === 0 ? (
                                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 text-center">
                                        <p className="text-sm text-red-600 dark:text-red-400 font-bold">Sin horarios disponibles para este día</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                        {disponibilidad.map(h => (
                                            <button
                                                key={h}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, hora: h })}
                                                className={`py-2.5 text-xs font-bold rounded-lg border transition-all active:scale-95 ${formData.hora === h ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                                            >
                                                {formatHoraAMPM(h)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.pacienteId || !formData.medicoId || !formData.fecha || !formData.hora}
                                className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-xl shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed group"
                            >
                                <CalendarCheck className="size-6 transition-transform group-hover:scale-110" />
                                <span className="text-lg">Finalizar y Agendar</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Gestión de Citas (List View) */
                <main className="px-4 py-6 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-slate-900 dark:text-slate-100 text-md font-bold leading-tight tracking-tight">
                            Gestión de Citas
                        </h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setStatusFilter('ACTIVA')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${statusFilter === 'ACTIVA' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}
                            >
                                Activas
                            </button>
                            <button 
                                onClick={() => setStatusFilter('COMPLETADA')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${statusFilter === 'COMPLETADA' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}
                            >
                                Completadas
                            </button>
                            <button 
                                onClick={() => setStatusFilter('CANCELADA')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${statusFilter === 'CANCELADA' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}
                            >
                                Canceladas
                            </button>
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por paciente, médico o especialidad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-slate-500">Actualizando agenda...</div>
                    ) : citasFiltradas.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <Clock className="size-10 mx-auto mb-3 opacity-20" />
                            <p>No se encontraron citas en este estado.</p>
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
                                            <p className="text-slate-900 dark:text-slate-100 text-base font-semibold mb-0">Paciente: {cita.paciente?.nombre || cita.pacienteId}</p>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-0">
                                                Médico: {cita.medico?.nombre || cita.medicoId}
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                                                Especialidad: {cita.medico?.especialidad || 'General'}
                                            </p>
                                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                <Calendar className="size-3" />
                                                <p className="text-xs">{formatearFecha(cita.fechaHora)}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center px-2 py-1 rounded ${cita.estado === 'CANCELADA' ? 'bg-red-100 dark:bg-red-900/30' : cita.estado === 'COMPLETADA' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${cita.estado === 'CANCELADA' ? 'text-red-700 dark:text-red-400' : cita.estado === 'COMPLETADA' ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'}`}>
                                                {cita.estado}
                                            </span>
                                        </div>
                                    </div>

                                    {statusFilter !== 'CANCELADA' && (
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform hover:bg-slate-100 dark:hover:bg-slate-700"
                                                onClick={() => {
                                                    const fechaObj = new Date(cita.fechaHora);
                                                    setRescheduleData({
                                                        citaId: cita.id!,
                                                        nuevoMedicoId: cita.medicoId.toString(),
                                                        fecha: fechaObj.toISOString().split('T')[0],
                                                        hora: '',
                                                        fechaOriginal: cita.fechaHora
                                                    });
                                                }}
                                            >
                                                Reprogramar
                                            </button>
                                            <button
                                                className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform hover:bg-red-100 dark:hover:bg-red-900/40"
                                                onClick={() => promptCancel(cita.id!)}
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
                onClose={() => {
                    setModalConfig({ ...modalConfig, isOpen: false });
                }}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            />

            {/* Modal de Reprogramación */}
            {rescheduleData.citaId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setRescheduleData({ citaId: null, nuevoMedicoId: '', fecha: '', hora: '', fechaOriginal: '' })}>
                   <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Reprogramar Cita</h3>
                            <p className="text-sm text-slate-500 mt-1">Selecciona el especialista y la nueva fecha.</p>
                        </div>
                        <div className="px-6 py-6 overflow-y-auto space-y-4">
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Especialista</label>
                                <select
                                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none appearance-none"
                                    value={rescheduleData.nuevoMedicoId}
                                    onChange={e => setRescheduleData({ ...rescheduleData, nuevoMedicoId: e.target.value, hora: '' })}
                                >
                                    <option value="">Seleccionar Médico</option>
                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>{m.nombre} - {m.especialidad}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fecha</label>
                                <input
                                    type="date"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
                                    value={rescheduleData.fecha}
                                    onChange={e => setRescheduleData({ ...rescheduleData, fecha: e.target.value, hora: '' })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Horarios Disponibles</label>
                                {loadingDisponibilidad ? (
                                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">Buscando horarios...</p>
                                ) : !rescheduleData.fecha || !rescheduleData.nuevoMedicoId ? (
                                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">Selecciona un médico y una fecha</p>
                                ) : disponibilidad.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl">No hay horarios disponibles</p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {disponibilidad.map(h => (
                                            <button
                                                key={h}
                                                onClick={() => setRescheduleData({ ...rescheduleData, hora: h })}
                                                className={`py-2 text-sm font-bold rounded-lg border transition-all ${rescheduleData.hora === h ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                                            >
                                                {formatHoraAMPM(h)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-shrink-0 justify-end gap-3 mt-auto">
                            <button
                                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all dark:text-slate-300 dark:hover:bg-slate-700"
                                onClick={() => setRescheduleData({ citaId: null, nuevoMedicoId: '', fecha: '', hora: '', fechaOriginal: '' })}
                            >
                                Cancelar
                            </button>
                            <button
                                className="rounded-xl px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                disabled={!rescheduleData.hora}
                                onClick={handleRescheduleSubmit}
                            >
                                Confirmar Cambio
                            </button>
                        </div>
                   </div>
                </div>
            )}
        </div>
    );
};
