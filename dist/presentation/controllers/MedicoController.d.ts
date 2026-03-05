import { Request, Response } from "express";
import { RegistrarMedicoUseCase } from "../../application/use-cases/RegistrarMedicoUseCase";
import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
export declare class MedicoController {
    private medicoRepository;
    private registrarUseCase;
    constructor(medicoRepository: IMedicoRepository, registrarUseCase: RegistrarMedicoUseCase);
    registrar(req: Request, res: Response): Promise<void>;
    listar(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MedicoController.d.ts.map