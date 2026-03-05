import React, { useEffect, useState } from 'react';
import { useMedicos } from '../../application/hooks/useMedicos';

export const Medicos: React.FC = () => {
    const { medicos, loading, fetchMedicos, registrarMedico } = useMedicos();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', especialidad: '', numero_licencia: '' });

    useEffect(() => {
        fetchMedicos();
    }, [fetchMedicos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registrarMedico(formData);
            setShowForm(false);
            setFormData({ nombre: '', especialidad: '', numero_licencia: '' });
        } catch (err) {
            alert('Error registrando médico');
        }
    };

    return (
        <div>
            <div className="flex-between">
                <h2>Gestión de Médicos</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancelar' : 'Nuevo Médico'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <h3>Registrar Médico</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                required
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej. Dr. Juan Pérez"
                            />
                        </div>
                        <div className="form-group">
                            <label>Especialidad</label>
                            <input
                                required
                                value={formData.especialidad}
                                onChange={e => setFormData({ ...formData, especialidad: e.target.value })}
                                placeholder="Ej. Cardiología"
                            />
                        </div>
                        <div className="form-group">
                            <label>Número de Licencia</label>
                            <input
                                required
                                value={formData.numero_licencia}
                                onChange={e => setFormData({ ...formData, numero_licencia: e.target.value })}
                                placeholder="Ej. CMP-12345"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            Guardar Médico
                        </button>
                    </form>
                </div>
            )}

            <div className="glass-card">
                {loading ? (
                    <div className="loading">Cargando médicos...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Especialidad</th>
                                    <th>Licencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicos.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center' }}>No hay médicos registrados.</td></tr>
                                ) : (
                                    medicos.map(medico => (
                                        <tr key={medico.id}>
                                            <td>{medico.id}</td>
                                            <td>{medico.nombre}</td>
                                            <td>{medico.especialidad}</td>
                                            <td>{medico.numero_licencia}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
