import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Users, CalendarCheck, CalendarDays, Calendar } from 'lucide-react';
import { useCitas } from '../../application/hooks/useCitas';

export const Dashboard: React.FC = () => {
    const { citas, fetchCitas, loading } = useCitas();

    useEffect(() => {
        fetchCitas();
    }, [fetchCitas]);

    const citasHoy = citas.filter(cita => {
        const fechaCita = new Date(cita.fechaHora).toDateString();
        const hoy = new Date().toDateString();
        return fechaCita === hoy && cita.estado !== 'CANCELADA';
    });

    const formatearHora = (fechaISO: string) => {
        const date = new Date(fechaISO);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="flex-1">
            {/* Search Bar */}
            <div className="px-4 py-4">
                <label className="flex flex-col w-full group">
                    <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary transition-all shadow-sm">
                        <div className="text-slate-400 flex items-center justify-center pl-4">
                            <Search className="size-5" />
                        </div>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 px-3 text-base placeholder:text-slate-400"
                            placeholder="Buscar expedientes médicos..."
                            type="text"
                        />
                    </div>
                </label>
            </div>

            {/* Quick Actions */}
            <section className="px-4 py-2">
                <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight mb-4 text-left">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/medicos" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserPlus className="size-7" />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Registrar Médico</span>
                    </Link>
                    <Link to="/pacientes" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="size-7" />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Registrar Paciente</span>
                    </Link>
                    <Link to="/citas" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarCheck className="size-7" />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Agendar Cita</span>
                    </Link>
                    <Link to="/citas" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarDays className="size-7" />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Disponibilidad</span>
                    </Link>
                </div>
            </section>

            {/* Today's Appointments */}
            <section className="px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Citas de Hoy</h2>
                    <Link className="text-primary text-sm font-medium" to="/citas">Ver todas</Link>
                </div>
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-10 text-center text-slate-500 text-sm font-medium">Cargando agenda...</div>
                    ) : citasHoy.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                           <Calendar className="size-8 mx-auto mb-2 opacity-20" />
                           <p className="text-sm">No hay citas programadas para hoy</p>
                        </div>
                    ) : (
                        citasHoy.map(cita => (
                            <div key={cita.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex flex-col items-center justify-center min-w-[64px] border-r border-slate-100 dark:border-slate-700 pr-4">
                                    <span className="text-primary font-bold text-base">{formatearHora(cita.fechaHora).split(' ')[0]}</span>
                                    <span className="text-slate-400 text-[10px] uppercase font-bold">{formatearHora(cita.fechaHora).split(' ')[1]}</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-0">
                                        {cita.paciente?.nombre || `Paciente #${cita.pacienteId}`}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                                        {cita.medico?.especialidad || 'Consulta'} - {cita.medico?.nombre || `Dr. #${cita.medicoId}`}
                                    </p>
                                </div>
                                <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};
