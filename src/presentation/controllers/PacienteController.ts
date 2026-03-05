import { Request, Response } from "express";
import { RegistrarPacienteUseCase } from "../../application/use-cases/RegistrarPacienteUseCase";
import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";

export class PacienteController {
    constructor(
        private pacienteRepository: IPacienteRepository,
        private registrarUseCase: RegistrarPacienteUseCase
    ) { }

    async registrar(req: Request, res: Response): Promise<void> {
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
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const pacientes = await this.pacienteRepository.findAll();
            res.status(200).json(pacientes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
