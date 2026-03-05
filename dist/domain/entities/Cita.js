"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cita = void 0;
class Cita {
    constructor(id, medicoId, pacienteId, fechaHora, estado = 'ACTIVA', medico, paciente) {
        this.id = id;
        this.medicoId = medicoId;
        this.pacienteId = pacienteId;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.medico = medico;
        this.paciente = paciente;
    }
    cancelar() {
        if (this.estado !== 'ACTIVA') {
            throw new Error("Solo se puede cancelar una cita activa.");
        }
        this.estado = 'CANCELADA';
    }
    reprogramar(nuevaFechaHora) {
        if (this.estado !== 'ACTIVA') {
            throw new Error("Solo se puede reprogramar una cita activa.");
        }
        const ahora = new Date();
        if (nuevaFechaHora < ahora) {
            throw new Error("No se puede agendar una cita en el pasado.");
        }
        this.fechaHora = nuevaFechaHora;
    }
}
exports.Cita = Cita;
Cita.DURACION_ESTANDAR_MINUTOS = 30;
