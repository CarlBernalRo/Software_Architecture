import { Paciente } from "../../domain/entities/Paciente";
import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
export declare class MysqlPacienteRepository implements IPacienteRepository {
    findById(id: number): Promise<Paciente | null>;
    save(paciente: Omit<Paciente, "id">): Promise<Paciente>;
    findAll(): Promise<Paciente[]>;
}
//# sourceMappingURL=MysqlPacienteRepository.d.ts.map