"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoController = void 0;
class MedicoController {
    constructor(medicoRepository, registrarUseCase) {
        this.medicoRepository = medicoRepository;
        this.registrarUseCase = registrarUseCase;
    }
    async registrar(req, res) {
        try {
            const { nombre, especialidad, licencia } = req.body;
            if (!nombre || !especialidad || !licencia) {
                res.status(400).json({ error: "Nombre, especialidad y licencia son obligatorios." });
                return;
            }
            const medico = await this.registrarUseCase.execute({ nombre, especialidad, licencia });
            res.status(201).json(medico);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async listar(req, res) {
        try {
            const medicos = await this.medicoRepository.findAll();
            res.status(200).json(medicos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.MedicoController = MedicoController;
