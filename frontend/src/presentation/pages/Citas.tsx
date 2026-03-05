import React, { useEffect, useState } from 'react';
import { useCitas } from '../../application/hooks/useCitas';
import { useMedicos } from '../../application/hooks/useMedicos';
import { usePacientes } from '../../application/hooks/usePacientes';

export const Citas: React.FC = () => {
    const { citas, loading, fetchCitas, agendarCita, cancelarCita } = useCitas();
    const { medicos, fetchMedicos } = useMedicos();
    const { pacientes, fetchPacientes } = usePacientes();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        paciente_id: '',
        medico_id: '',
        fecha_hora: ''
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
                paciente_id: parseInt(formData.paciente_id),
                medico_id: parseInt(formData.medico_id),
                fecha_hora: formData.fecha_hora // ensure ISO format? using simple local-datetime input
            });
            setShowForm(false);
            setFormData({ paciente_id: '', medico_id: '', fecha_hora: '' });
        } catch (err) {
            alert('Error agendando cita');
        }
    };

    const formatearFecha = (fechaISO: string) => {
        try {
            return new Date(fechaISO).toLocaleString();
        } catch {
            return fechaISO;
        }
    };

    const renderBadge = (estado: string) => {
        switch (estado) {
            case 'PROGRAMADA': return <span className="badge badge-success">{estado}</span>;
            case 'CANCELADA': return <span className="badge badge-danger">{estado}</span>;
            case 'COMPLETADA': return <span className="badge badge-warning">{estado}</span>;
            default: return <span className="badge">{estado}</span>;
        }
    };

    return (
        <div>
            <div className="flex-between">
                <h2>Gestión de Citas</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancelar' : 'Agendar Cita'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <h3>Agendar Nueva Cita</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Paciente</label>
                                <select
                                    required
                                    value={formData.paciente_id}
                                    onChange={e => setFormData({ ...formData, paciente_id: e.target.value })}
                                >
                                    <option value="">Seleccione Paciente</option>
                                    {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Médico</label>
                                <select
                                    required
                                    value={formData.medico_id}
                                    onChange={e => setFormData({ ...formData, medico_id: e.target.value })}
                                >
                                    <option value="">Seleccione Médico</option>
                                    {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.especialidad})</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Fecha y Hora</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.fecha_hora}
                                    onChange={e => setFormData({ ...formData, fecha_hora: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            Guardar Cita
                        </button>
                    </form>
                </div>
            )}

            <div className="glass-card">
                {loading ? (
                    <div className="loading">Cargando citas...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Paciente (ID)</th>
                                    <th>Médico (ID)</th>
                                    <th>Fecha/Hora</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center' }}>No hay citas registradas.</td></tr>
                                ) : (
                                    citas.map(cita => (
                                        <tr key={cita.id}>
                                            <td>{cita.id}</td>
                                            <td>{cita.paciente?.nombre || cita.paciente_id}</td>
                                            <td>{cita.medico?.nombre || cita.medico_id}</td>
                                            <td>{formatearFecha(cita.fecha_hora)}</td>
                                            <td>{renderBadge(cita.estado)}</td>
                                            <td>
                                                {cita.estado !== 'CANCELADA' && (
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                        onClick={() => cancelarCita(cita.id!)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </td>
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
