import { useState, useCallback } from "react";
import type { Medico } from "../../domain/models/Medico";
import { MedicoRepository } from "../../infrastructure/repositories/MedicoRepository";

export const useMedicos = () => {
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMedicos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await MedicoRepository.listar();
            setMedicos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const registrarMedico = async (medicoProps: Omit<Medico, "id" | "created_at" | "updated_at">) => {
        setLoading(true);
        setError(null);
        try {
            const nuevoMedico = await MedicoRepository.registrar(medicoProps);
            setMedicos((prev) => [...prev, nuevoMedico]);
            return nuevoMedico;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        medicos,
        loading,
        error,
        fetchMedicos,
        registrarMedico,
    };
};
