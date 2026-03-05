"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelarCitaUseCase = void 0;
class CancelarCitaUseCase {
    constructor(citaRepository) {
        this.citaRepository = citaRepository;
    }
    async execute(citaId) {
        const cita = await this.citaRepository.findById(citaId);
        if (!cita)
            throw new Error("Cita no encontrada.");
        cita.cancelar(); // Lógica de dominio
        await this.citaRepository.update(cita);
    }
}
exports.CancelarCitaUseCase = CancelarCitaUseCase;
