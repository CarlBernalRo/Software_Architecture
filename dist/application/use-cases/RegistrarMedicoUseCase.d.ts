import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
import { Medico } from "../../domain/entities/Medico";
export declare class RegistrarMedicoUseCase {
    private readonly medicoRepository;
    constructor(medicoRepository: IMedicoRepository);
    execute(data: {
        nombre: string;
        especialidad: string;
        licencia: string;
    }): Promise<Medico>;
}
//# sourceMappingURL=RegistrarMedicoUseCase.d.ts.map