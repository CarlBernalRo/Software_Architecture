import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
export declare class ConsultarDisponibilidadUseCase {
    private readonly citaRepository;
    constructor(citaRepository: ICitaRepository);
    execute(medicoId: number, fecha: Date): Promise<string[]>;
}
//# sourceMappingURL=ConsultarDisponibilidadUseCase.d.ts.map