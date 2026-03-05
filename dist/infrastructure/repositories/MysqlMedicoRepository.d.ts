import { Medico } from "../../domain/entities/Medico";
import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
export declare class MysqlMedicoRepository implements IMedicoRepository {
    findById(id: number): Promise<Medico | null>;
    save(medico: Omit<Medico, "id">): Promise<Medico>;
    findAll(): Promise<Medico[]>;
}
//# sourceMappingURL=MysqlMedicoRepository.d.ts.map