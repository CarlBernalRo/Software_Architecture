import { Cita } from "../../domain/entities/Cita";
import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
export declare class MysqlCitaRepository implements ICitaRepository {
    findById(id: number): Promise<Cita | null>;
    save(cita: Omit<Cita, "id">): Promise<Cita>;
    update(cita: Cita): Promise<void>;
    findActivasByMedicoAndDate(medicoId: number, fecha: Date): Promise<Cita[]>;
    findByMedicoAndDateRange(medicoId: number, inicio: Date, fin: Date): Promise<Cita[]>;
}
//# sourceMappingURL=MysqlCitaRepository.d.ts.map