import { Medico } from "./Medico";
import { Paciente } from "./Paciente";

export type EstadoCita = 'ACTIVA' | 'CANCELADA' | 'COMPLETADA';

export class Cita {
    public static readonly DURACION_ESTANDAR_MINUTOS = 30;

    constructor(
        public readonly id: number,
        public medicoId: number,
        public readonly pacienteId: number,
        public fechaHora: Date,
        public estado: EstadoCita = 'ACTIVA',
        public medico?: Medico,
        public paciente?: Paciente
    ) { }

    cancelar(): void {
        if (this.estado !== 'ACTIVA') {
            throw new Error("Solo se puede cancelar una cita activa.");
        }
        this.estado = 'CANCELADA';
    }

    completar(): void {
        if (this.estado !== 'ACTIVA') {
            throw new Error("Solo se puede completar una cita activa.");
        }
        this.estado = 'COMPLETADA';
    }

    reprogramar(nuevaFechaHora: Date, nuevoMedicoId: number): void {
        const ahora = new Date();
        if (nuevaFechaHora < ahora) {
            throw new Error("No se puede agendar una cita en el pasado.");
        }
        this.fechaHora = nuevaFechaHora;
        this.medicoId = nuevoMedicoId;
        this.estado = 'ACTIVA';
    }
}
