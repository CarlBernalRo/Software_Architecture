import type { Medico } from "../../domain/models/Medico";
import { httpClient } from "../api/client";

export class MedicoRepository {
    static async registrar(medico: Omit<Medico, "id" | "created_at" | "updated_at">): Promise<Medico> {
        return httpClient<Medico>("/medicos", {
            method: "POST",
            body: JSON.stringify(medico),
        });
    }

    static async listar(): Promise<Medico[]> {
        return httpClient<Medico[]>("/medicos");
    }
}
