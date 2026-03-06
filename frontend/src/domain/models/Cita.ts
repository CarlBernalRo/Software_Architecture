import type { Medico } from "./Medico";
import type { Paciente } from "./Paciente";

export interface Cita {
    id?: number;
    pacienteId: number;
    medicoId: number;
    fechaHora: string; // ISO string 
    estado: "PROGRAMADA" | "CANCELADA" | "COMPLETADA";
    created_at?: Date;
    updated_at?: Date;
    // Optional relations
    medico?: Medico;
    paciente?: Paciente;
}
