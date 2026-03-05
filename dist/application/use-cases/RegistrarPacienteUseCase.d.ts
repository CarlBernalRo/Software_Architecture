import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
import { Paciente } from "../../domain/entities/Paciente";
export declare class RegistrarPacienteUseCase {
    private readonly pacienteRepository;
    constructor(pacienteRepository: IPacienteRepository);
    execute(data: {
        nombre: string;
        documento: string;
        correo: string;
    }): Promise<Paciente>;
}
//# sourceMappingURL=RegistrarPacienteUseCase.d.ts.map