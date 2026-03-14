import { ICitaRepository } from "../../domain/repositories/ICitaRepository";

export class CompletarCitaUseCase {
    constructor(private citaRepository: ICitaRepository) {}

    async execute(id: number): Promise<void> {
        const cita = await this.citaRepository.findById(id);
        if (!cita) {
            throw new Error("La cita no existe.");
        }

        // Add method to entity or just manually change state
        if (cita.estado !== 'ACTIVA') {
            throw new Error("Solo se puede completar una cita ACTIVA.");
        }
        
        cita.estado = 'COMPLETADA';
        await this.citaRepository.update(cita);
    }
}
