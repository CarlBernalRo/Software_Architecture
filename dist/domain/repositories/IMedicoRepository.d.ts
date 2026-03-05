import { Medico } from "../entities/Medico";
export interface IMedicoRepository {
    findById(id: number): Promise<Medico | null>;
    save(medico: Omit<Medico, 'id'>): Promise<Medico>;
    findAll(): Promise<Medico[]>;
}
//# sourceMappingURL=IMedicoRepository.d.ts.map