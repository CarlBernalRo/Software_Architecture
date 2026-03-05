import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
import { Cita } from "../../domain/entities/Cita";
export declare class AgendarCitaUseCase {
    private readonly citaRepository;
    private readonly medicoRepository;
    private readonly pacienteRepository;
    constructor(citaRepository: ICitaRepository, medicoRepository: IMedicoRepository, pacienteRepository: IPacienteRepository);
    execute(medicoId: number, pacienteId: number, fechaHora: Date): Promise<Cita>;
}
//# sourceMappingURL=AgendarCitaUseCase.d.ts.map