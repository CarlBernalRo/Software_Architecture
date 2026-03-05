"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendarCitaUseCase = void 0;
const Cita_1 = require("../../domain/entities/Cita");
class AgendarCitaUseCase {
    constructor(citaRepository, medicoRepository, pacienteRepository) {
        this.citaRepository = citaRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
    }
    async execute(medicoId, pacienteId, fechaHora) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico)
            throw new Error("Médico no encontrado.");
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente)
            throw new Error("Paciente no encontrado.");
        if (fechaHora < new Date()) {
            throw new Error("No se puede agendar una cita en el pasado.");
        }
        // Calcular fin de cita
        const finCita = new Date(fechaHora.getTime() + Cita_1.Cita.DURACION_ESTANDAR_MINUTOS * 60000);
        // Verificar disponibilidad del médico en ese rango
        const solapamientos = await this.citaRepository.findByMedicoAndDateRange(medicoId, fechaHora, finCita);
        if (solapamientos.length > 0) {
            throw new Error("El médico ya tiene una cita en ese horario.");
        }
        const nuevaCita = new Cita_1.Cita(0, medicoId, pacienteId, fechaHora, "ACTIVA");
        return await this.citaRepository.save(nuevaCita);
    }
}
exports.AgendarCitaUseCase = AgendarCitaUseCase;
