import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
export declare class ReprogramarCitaUseCase {
    private readonly citaRepository;
    constructor(citaRepository: ICitaRepository);
    execute(citaId: number, nuevaFechaHora: Date): Promise<void>;
}
//# sourceMappingURL=ReprogramarCitaUseCase.d.ts.map