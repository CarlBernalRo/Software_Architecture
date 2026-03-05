import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Médicos', path: '/medicos' },
        { name: 'Pacientes', path: '/pacientes' },
        { name: 'Citas', path: '/citas' },
    ];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-title">
                    🏥 Clínica
                </div>
                <nav>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};
