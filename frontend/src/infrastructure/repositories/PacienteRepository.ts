import type { Paciente } from "../../domain/models/Paciente";
import { httpClient } from "../api/client";

export class PacienteRepository {
    static async registrar(paciente: Omit<Paciente, "id" | "created_at" | "updated_at">): Promise<Paciente> {
        return httpClient<Paciente>("/pacientes", {
            method: "POST",
            body: JSON.stringify(paciente),
        });
    }

    static async listar(): Promise<Paciente[]> {
        return httpClient<Paciente[]>("/pacientes");
    }
}
