"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteController = void 0;
class PacienteController {
    constructor(pacienteRepository, registrarUseCase) {
        this.pacienteRepository = pacienteRepository;
        this.registrarUseCase = registrarUseCase;
    }
    async registrar(req, res) {
        try {
            const { nombre, documento, correo } = req.body;
            if (!nombre || !documento || !correo) {
                res.status(400).json({ error: "Nombre, documento y correo son obligatorios." });
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                res.status(400).json({ error: "El formato del correo es inválido." });
                return;
            }
            const paciente = await this.registrarUseCase.execute({ nombre, documento, correo });
            res.status(201).json(paciente);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async listar(req, res) {
        try {
            const pacientes = await this.pacienteRepository.findAll();
            res.status(200).json(pacientes);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PacienteController = PacienteController;
