"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarPacienteUseCase = void 0;
class RegistrarPacienteUseCase {
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }
    async execute(data) {
        const pacientes = await this.pacienteRepository.findAll();
        const existe = pacientes.find(p => p.documento === data.documento || p.correo === data.correo);
        if (existe) {
            throw new Error("Ya existe un paciente con ese documento o correo.");
        }
        return await this.pacienteRepository.save(data);
    }
}
exports.RegistrarPacienteUseCase = RegistrarPacienteUseCase;
