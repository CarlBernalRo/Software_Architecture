import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
import { Cita } from "../../domain/entities/Cita";

export class ReprogramarCitaUseCase {
    constructor(private readonly citaRepository: ICitaRepository) { }

    async execute(citaId: number, nuevaFechaHora: Date): Promise<void> {
        const cita = await this.citaRepository.findById(citaId);
        if (!cita) throw new Error("Cita no encontrada.");

        // Verificar disponibilidad para la nueva fecha (Mismo comprobación que Agendar)
        const finCita = new Date(nuevaFechaHora.getTime() + Cita.DURACION_ESTANDAR_MINUTOS * 60000);
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
