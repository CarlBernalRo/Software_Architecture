import React from 'react';

export const Dashboard: React.FC = () => {
    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Panel de Control</h1>
                    <p className="text-muted">Resumen del sistema de gestión de citas médicas.</p>
                </div>
            </div>

            <div className="grid-2">
                <div className="glass-card">
                    <h3>Médicos Activos</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '1rem' }}>
                        +
                    </p>
                    <p>Gestiona el personal médico</p>
                </div>

                <div className="glass-card">
                    <h3>Citas Hoy</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)', marginTop: '1rem' }}>
                        +
                    </p>
                    <p>Revisa la agenda del día</p>
                </div>

                <div className="glass-card">
                    <h3>Pacientes</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F59E0B', marginTop: '1rem' }}>
                        +
                    </p>
                    <p>Administra registros de pacientes</p>
                </div>
            </div>
        </div>
    );
};
