import { ICitaRepository } from "../../domain/repositories/ICitaRepository";

export class CancelarCitaUseCase {
    constructor(private readonly citaRepository: ICitaRepository) { }

    async execute(citaId: number): Promise<void> {
        const cita = await this.citaRepository.findById(citaId);
        if (!cita) throw new Error("Cita no encontrada.");

        cita.cancelar(); // Lógica de dominio

        await this.citaRepository.update(cita);
    }
}
