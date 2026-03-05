import React, { useEffect, useState } from 'react';
import { usePacientes } from '../../application/hooks/usePacientes';

export const Pacientes: React.FC = () => {
    const { pacientes, loading, fetchPacientes, registrarPaciente } = usePacientes();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', documento: '', correo_electronico: '' });

    useEffect(() => {
        fetchPacientes();
    }, [fetchPacientes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registrarPaciente(formData);
            setShowForm(false);
            setFormData({ nombre: '', documento: '', correo_electronico: '' });
        } catch (err) {
            alert('Error registrando paciente');
        }
    };

    return (
        <div>
            <div className="flex-between">
                <h2>Gestión de Pacientes</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancelar' : 'Nuevo Paciente'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <h3>Registrar Paciente</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                required
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej. María Gómez"
                            />
                        </div>
                        <div className="form-group">
                            <label>Documento de Identidad</label>
                            <input
                                required
                                value={formData.documento}
                                onChange={e => setFormData({ ...formData, documento: e.target.value })}
                                placeholder="Ej. 12345678"
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={formData.correo_electronico}
                                onChange={e => setFormData({ ...formData, correo_electronico: e.target.value })}
                                placeholder="Ej. maria@ejemplo.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            Guardar Paciente
                        </button>
                    </form>
                </div>
            )}

            <div className="glass-card">
                {loading ? (
                    <div className="loading">Cargando pacientes...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Documento</th>
                                    <th>Correo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center' }}>No hay pacientes registrados.</td></tr>
                                ) : (
                                    pacientes.map(paciente => (
                                        <tr key={paciente.id}>
                                            <td>{paciente.id}</td>
                                            <td>{paciente.nombre}</td>
                                            <td>{paciente.documento}</td>
                                            <td>{paciente.correo_electronico}</td>
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
