import { Request, Response } from "express";
import { RegistrarPacienteUseCase } from "../../application/use-cases/RegistrarPacienteUseCase";
import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
export declare class PacienteController {
    private pacienteRepository;
    private registrarUseCase;
    constructor(pacienteRepository: IPacienteRepository, registrarUseCase: RegistrarPacienteUseCase);
    registrar(req: Request, res: Response): Promise<void>;
    listar(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PacienteController.d.ts.map