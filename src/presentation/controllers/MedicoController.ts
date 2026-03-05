import { Request, Response } from "express";
import { RegistrarMedicoUseCase } from "../../application/use-cases/RegistrarMedicoUseCase";
import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";

export class MedicoController {
    constructor(
        private medicoRepository: IMedicoRepository,
        private registrarUseCase: RegistrarMedicoUseCase
    ) { }

    async registrar(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, especialidad, licencia } = req.body;
            if (!nombre || !especialidad || !licencia) {
                res.status(400).json({ error: "Nombre, especialidad y licencia son obligatorios." });
                return;
            }

            const medico = await this.registrarUseCase.execute({ nombre, especialidad, licencia });
            res.status(201).json(medico);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const medicos = await this.medicoRepository.findAll();
            res.status(200).json(medicos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
