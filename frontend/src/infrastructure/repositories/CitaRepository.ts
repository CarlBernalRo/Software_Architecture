import type { Cita } from "../../domain/models/Cita";
import { httpClient } from "../api/client";

export class CitaRepository {
    static async agendar(cita: Omit<Cita, "id" | "estado" | "created_at" | "updated_at">): Promise<Cita> {
        return httpClient<Cita>("/citas", {
            method: "POST",
            body: JSON.stringify(cita),
        });
    }

    static async listar(): Promise<Cita[]> {
        return httpClient<Cita[]>("/citas");
    }

    static async cancelar(id: number): Promise<Cita> {
        return httpClient<Cita>(`/citas/${id}/cancelar`, {
            method: "PATCH",
        });
    }

    static async completar(id: number): Promise<Cita> {
        return httpClient<Cita>(`/citas/${id}/completar`, {
            method: "PATCH",
        });
    }

    static async reprogramar(id: number, nuevaFechaHora: string, nuevoMedicoId?: number): Promise<Cita> {
        return httpClient<Cita>(`/citas/${id}/reprogramar`, {
            method: "PATCH",
            body: JSON.stringify({ fecha_hora: nuevaFechaHora, medico_id: nuevoMedicoId }),
        });
    }

    static async consultarDisponibilidad(medicoId: number, fecha: string): Promise<string[]> {
        return httpClient<string[]>(`/citas/disponibilidad?medicoId=${medicoId}&fecha=${fecha}`);
    }
}
