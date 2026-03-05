"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReprogramarCitaUseCase = void 0;
const Cita_1 = require("../../domain/entities/Cita");
class ReprogramarCitaUseCase {
    constructor(citaRepository) {
        this.citaRepository = citaRepository;
    }
    async execute(citaId, nuevaFechaHora) {
        const cita = await this.citaRepository.findById(citaId);
        if (!cita)
            throw new Error("Cita no encontrada.");
        // Verificar disponibilidad para la nueva fecha (Mismo comprobación que Agendar)
        const finCita = new Date(nuevaFechaHora.getTime() + Cita_1.Cita.DURACION_ESTANDAR_MINUTOS * 60000);
        const solapamientos = await this.citaRepository.findByMedicoAndDateRange(cita.medicoId, nuevaFechaHora, finCita);
        // Ignorar si el solapamiento es la cita misma
        const conflicto = solapamientos.find(c => c.id !== cita.id);
        if (conflicto) {
            throw new Error("El médico tiene otra cita en el nuevo horario.");
        }
        cita.reprogramar(nuevaFechaHora); // Regla de dominio (valida fecha pasada y estado activa)
        await this.citaRepository.update(cita);
    }
}
exports.ReprogramarCitaUseCase = ReprogramarCitaUseCase;
