import type { Medico } from "./Medico";
import type { Paciente } from "./Paciente";

export interface Cita {
    id?: number;
    paciente_id: number;
    medico_id: number;
    fecha_hora: string; // ISO string 
    estado: "PROGRAMADA" | "CANCELADA" | "COMPLETADA";
    created_at?: Date;
    updated_at?: Date;
    // Optional relations
    medico?: Medico;
    paciente?: Paciente;
}
