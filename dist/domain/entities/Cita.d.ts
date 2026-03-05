import { Medico } from "./Medico";
import { Paciente } from "./Paciente";
export type EstadoCita = 'ACTIVA' | 'CANCELADA' | 'COMPLETADA';
export declare class Cita {
    readonly id: number;
    readonly medicoId: number;
    readonly pacienteId: number;
    fechaHora: Date;
    estado: EstadoCita;
    medico?: Medico | undefined;
    paciente?: Paciente | undefined;
    static readonly DURACION_ESTANDAR_MINUTOS = 30;
    constructor(id: number, medicoId: number, pacienteId: number, fechaHora: Date, estado?: EstadoCita, medico?: Medico | undefined, paciente?: Paciente | undefined);
    cancelar(): void;
    reprogramar(nuevaFechaHora: Date): void;
}
//# sourceMappingURL=Cita.d.ts.map