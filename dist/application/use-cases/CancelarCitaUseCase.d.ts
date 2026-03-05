import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
export declare class CancelarCitaUseCase {
    private readonly citaRepository;
    constructor(citaRepository: ICitaRepository);
    execute(citaId: number): Promise<void>;
}
//# sourceMappingURL=CancelarCitaUseCase.d.ts.map