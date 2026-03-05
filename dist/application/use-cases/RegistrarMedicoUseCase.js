"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarMedicoUseCase = void 0;
class RegistrarMedicoUseCase {
    constructor(medicoRepository) {
        this.medicoRepository = medicoRepository;
    }
    async execute(data) {
        const medicos = await this.medicoRepository.findAll();
        const existe = medicos.find(m => m.licencia === data.licencia);
        if (existe) {
            throw new Error("Ya existe un médico con esa licencia.");
        }
        return await this.medicoRepository.save(data);
    }
}
exports.RegistrarMedicoUseCase = RegistrarMedicoUseCase;
