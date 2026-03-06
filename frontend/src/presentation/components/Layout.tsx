import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Panel', path: '/', icon: 'grid_view' },
        { name: 'Citas', path: '/citas', icon: 'calendar_today' },
        { name: 'Pacientes', path: '/pacientes', icon: 'groups' },
        { name: 'Médicos', path: '/medicos', icon: 'stethoscope' },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            {/* Header */}
            <header className="flex items-center bg-white dark:bg-slate-900 p-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 justify-between">
                <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full bg-primary/10">
                    <img
                        alt="Logo"
                        className="h-full w-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgk65TqLUkXWAK2sk2Kb-gDGd7WpyV1dAfKp3C2TPEwIJ3lKniCObBJdMGHXiBznlvBbDJ5LeeYcMiBnBB1V8d7EwOosSWeQNxTnaQUyHjEljxREh5NPEa83KLgXeQJ3vqd4ZJXGyiPMI6IG3nhbFlOHRxyYsQHUCHFSZsL9HfU4qQW2rjlFvSN5QS-9o1AGP4x-0sGgXcNxGHaLWukWZTeurCoAajQ_mjH74KIOnTlnrMw3ZdqiOvzF9H7_ZuyNoHt3V4tzFMczqN"
                    />
                </div>
                <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                    Panel Clínica Univ.
                </h1>
                <div className="flex w-10 items-center justify-end">
                    <button className="flex items-center justify-center rounded-full h-10 w-10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-24">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-3 flex justify-between items-center z-20">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
