import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
import { Cita, EstadoCita } from "../../domain/entities/Cita";

export class AgendarCitaUseCase {
    constructor(
        private readonly citaRepository: ICitaRepository,
        private readonly medicoRepository: IMedicoRepository,
        private readonly pacienteRepository: IPacienteRepository
    ) { }

    async execute(medicoId: number, pacienteId: number, fechaHora: Date): Promise<Cita> {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error("Médico no encontrado.");

        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new Error("Paciente no encontrado.");

        if (fechaHora < new Date()) {
            throw new Error("No se puede agendar una cita en el pasado.");
        }

        // Calcular fin de cita
        const finCita = new Date(fechaHora.getTime() + Cita.DURACION_ESTANDAR_MINUTOS * 60000);

        // Verificar disponibilidad del médico en ese rango
        const solapamientos = await this.citaRepository.findByMedicoAndDateRange(medicoId, fechaHora, finCita);
        if (solapamientos.length > 0) {
            throw new Error("El médico ya tiene una cita en ese horario.");
        }

        const nuevaCita = new Cita(0, medicoId, pacienteId, fechaHora, "ACTIVA");
        return await this.citaRepository.save(nuevaCita);
    }
}
