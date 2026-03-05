import { Request, Response } from "express";
import { AgendarCitaUseCase } from "../../application/use-cases/AgendarCitaUseCase";
import { CancelarCitaUseCase } from "../../application/use-cases/CancelarCitaUseCase";
import { ReprogramarCitaUseCase } from "../../application/use-cases/ReprogramarCitaUseCase";
import { ConsultarDisponibilidadUseCase } from "../../application/use-cases/ConsultarDisponibilidadUseCase";
import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
export declare class CitaController {
    private citaRepository;
    private agendarUseCase;
    private cancelarUseCase;
    private reprogramarUseCase;
    private consultarUseCase;
    constructor(citaRepository: ICitaRepository, agendarUseCase: AgendarCitaUseCase, cancelarUseCase: CancelarCitaUseCase, reprogramarUseCase: ReprogramarCitaUseCase, consultarUseCase: ConsultarDisponibilidadUseCase);
    agendar(req: Request, res: Response): Promise<void>;
    cancelar(req: Request, res: Response): Promise<void>;
    reprogramar(req: Request, res: Response): Promise<void>;
    consultarDisponibilidad(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CitaController.d.ts.map