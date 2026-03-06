import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    return (
        <div className="flex-1">
            {/* Search Bar */}
            <div className="px-4 py-4">
                <label className="flex flex-col w-full group">
                    <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary transition-all shadow-sm">
                        <div className="text-slate-400 flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined">search</span>
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
                            <span className="material-symbols-outlined text-3xl">person_add</span>
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Registrar Médico</span>
                    </Link>
                    <Link to="/pacientes" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">group_add</span>
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Registrar Paciente</span>
                    </Link>
                    <Link to="/citas" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">event_available</span>
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold text-center">Agendar Cita</span>
                    </Link>
                    <Link to="/citas" className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform no-underline">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">calendar_month</span>
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
                    {/* Mock Data for now, could be dynamic later */}
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex flex-col items-center justify-center min-w-[56px] border-r border-slate-100 dark:border-slate-700 pr-4">
                            <span className="text-primary font-bold text-lg">09:00</span>
                            <span className="text-slate-400 text-xs uppercase font-medium">AM</span>
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-0">Carlos Méndez</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">Medicina General - Dr. Arriaga</p>
                        </div>
                        <div className="size-2 rounded-full bg-green-500"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};
