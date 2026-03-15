import { useState, useCallback } from "react";
import type { Cita } from "../../domain/models/Cita";
import { CitaRepository } from "../../infrastructure/repositories/CitaRepository";

export const useCitas = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCitas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CitaRepository.listar();
            setCitas(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const agendarCita = async (citaProps: Omit<Cita, "id" | "estado" | "created_at" | "updated_at">) => {
        setLoading(true);
        setError(null);
        try {
            const nuevaCita = await CitaRepository.agendar(citaProps);
            setCitas((prev) => [...prev, nuevaCita]);
            return nuevaCita;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelarCita = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await CitaRepository.cancelar(id);
            setCitas((prev) => prev.map(c => c.id === id ? { ...c, estado: "CANCELADA" } : c));
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const completarCita = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await CitaRepository.completar(id);
            setCitas((prev) => prev.map(c => c.id === id ? { ...c, estado: "COMPLETADA" } : c));
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reprogramarCita = async (id: number, nuevaFechaHora: string, nuevoMedicoId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const updatedCita = await CitaRepository.reprogramar(id, nuevaFechaHora, nuevoMedicoId);
            setCitas((prev) => prev.map(c => c.id === id ? updatedCita : c));
            return updatedCita;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const consultarDisponibilidad = async (medicoId: number, fecha: string) => {
        setLoading(true);
        setError(null);
        try {
            const horarios = await CitaRepository.consultarDisponibilidad(medicoId, fecha);
            setDisponibilidad(horarios);
            return horarios;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        citas,
        disponibilidad,
        loading,
        error,
        fetchCitas,
        agendarCita,
        cancelarCita,
        completarCita,
        reprogramarCita,
        consultarDisponibilidad
    };
};
