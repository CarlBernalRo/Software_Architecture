import React, { useEffect, useState } from 'react';
import { Modal } from '../components/Modal';
import { useMedicos } from '../../application/hooks/useMedicos';

export const Medicos: React.FC = () => {
    const { medicos, loading, fetchMedicos, registrarMedico } = useMedicos();
    const [showForm, setShowForm] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'error' | 'success' });
    const [formData, setFormData] = useState({ nombre: '', especialidad: '', licencia: '' });

    useEffect(() => {
        fetchMedicos();
    }, [fetchMedicos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registrarMedico(formData);
            setShowForm(false);
            setFormData({ nombre: '', especialidad: '', licencia: '' });
            setModalConfig({ isOpen: true, title: 'Éxito', message: 'Médico registrado correctamente', type: 'success' });
        } catch (err: any) {
            setModalConfig({ isOpen: true, title: 'Error', message: err.message, type: 'error' });
        }
    };

    return (
        <div className="flex-1 px-5 pt-6 pb-24 max-w-2xl mx-auto">
            {/* Header / Hero Section */}
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-5xl">person_add</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nuevo Especialista</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Ingrese los datos para dar de alta al médico en el sistema de la clínica universitaria.
                </p>
                <button
                    className="mt-4 btn bg-primary text-white rounded-xl px-6 py-2 font-bold"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Ver Listado' : 'Registrar Nuevo'}
                </button>
            </div>

            {showForm ? (
                <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Nombre Completo
                        </label>
                        <div className="relative">
                            <input
                                required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3.5 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej. Dr. Alejandro Rivera"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Especialidad Médica
                        </label>
                        <div className="relative">
                            <select
                                required
                                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3.5 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.especialidad}
                                onChange={e => setFormData({ ...formData, especialidad: e.target.value })}
                            >
                                <option value="" disabled>Seleccione una especialidad</option>
                                <option value="Medicina General">Medicina General</option>
                                <option value="Cardiología">Cardiología</option>
                                <option value="Pediatría">Pediatría</option>
                                <option value="Dermatología">Dermatología</option>
                                <option value="Psiquiatría">Psiquiatría</option>
                                <option value="Odontología">Odontología</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Número de Cédula Profesional
                        </label>
                        <div className="relative">
                            <input
                                required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3.5 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                                value={formData.licencia}
                                onChange={e => setFormData({ ...formData, licencia: e.target.value })}
                                placeholder="Ej. CP-982341-X"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-primary px-6 py-4 text-center font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98]"
                        >
                            {loading ? 'Guardando...' : 'Guardar Registro'}
                        </button>
                    </div>
                </form>
            ) : (
                /* List View */
                <div className="space-y-3">
                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight text-left">Especialistas Registrados</h3>
                    {loading ? (
                        <div className="py-8 text-center text-slate-500">Cargando médicos...</div>
                    ) : medicos.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            No hay médicos registrados.
                        </div>
                    ) : (
                        medicos.map(medico => (
                            <div key={medico.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-2xl">medical_services</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-0">{medico.nombre}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs">{medico.especialidad} • {medico.licencia}</p>
                                </div>
                                <div className="size-2 rounded-full bg-green-500"></div>
                            </div>
                        ))
                    )}
                </div>
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
