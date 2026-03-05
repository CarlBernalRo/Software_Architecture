"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitaController = void 0;
class CitaController {
    constructor(citaRepository, agendarUseCase, cancelarUseCase, reprogramarUseCase, consultarUseCase) {
        this.citaRepository = citaRepository;
        this.agendarUseCase = agendarUseCase;
        this.cancelarUseCase = cancelarUseCase;
        this.reprogramarUseCase = reprogramarUseCase;
        this.consultarUseCase = consultarUseCase;
    }
    async agendar(req, res) {
        try {
            const { medicoId, pacienteId, fechaHora } = req.body;
            if (!medicoId || !pacienteId || !fechaHora) {
                res.status(400).json({ error: "medicoId, pacienteId y fechaHora son obligatorios." });
                return;
            }
            const cita = await this.agendarUseCase.execute(Number(medicoId), Number(pacienteId), new Date(fechaHora));
            res.status(201).json(cita);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async cancelar(req, res) {
        try {
            const { id } = req.params;
            await this.cancelarUseCase.execute(Number(id));
            res.status(200).json({ message: "Cita cancelada correctamente." });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async reprogramar(req, res) {
        try {
            const { id } = req.params;
            const { nuevaFechaHora } = req.body;
            if (!nuevaFechaHora) {
                res.status(400).json({ error: "nuevaFechaHora es obligatorio." });
                return;
            }
            await this.reprogramarUseCase.execute(Number(id), new Date(nuevaFechaHora));
            res.status(200).json({ message: "Cita reprogramada correctamente." });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async consultarDisponibilidad(req, res) {
        try {
            const { medicoId, fecha } = req.query;
            if (!medicoId || !fecha) {
                res.status(400).json({ error: "medicoId y fecha son obligatorios como parámetros de consulta." });
                return;
            }
            const huecos = await this.consultarUseCase.execute(Number(medicoId), new Date(fecha));
            res.status(200).json({ huecosDisponibles: huecos });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.CitaController = CitaController;
