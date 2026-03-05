import { useState, useCallback } from "react";
import type { Paciente } from "../../domain/models/Paciente";
import { PacienteRepository } from "../../infrastructure/repositories/PacienteRepository";

export const usePacientes = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPacientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await PacienteRepository.listar();
            setPacientes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const registrarPaciente = async (pacienteProps: Omit<Paciente, "id" | "created_at" | "updated_at">) => {
        setLoading(true);
        setError(null);
        try {
            const nuevoPaciente = await PacienteRepository.registrar(pacienteProps);
            setPacientes((prev) => [...prev, nuevoPaciente]);
            return nuevoPaciente;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        pacientes,
        loading,
        error,
        fetchPacientes,
        registrarPaciente,
    };
};
