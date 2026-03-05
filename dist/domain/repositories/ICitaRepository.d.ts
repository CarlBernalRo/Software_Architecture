import { Cita } from "../entities/Cita";
export interface ICitaRepository {
    findById(id: number): Promise<Cita | null>;
    save(cita: Omit<Cita, 'id'>): Promise<Cita>;
    update(cita: Cita): Promise<void>;
    findActivasByMedicoAndDate(medicoId: number, fecha: Date): Promise<Cita[]>;
    findByMedicoAndDateRange(medicoId: number, inicio: Date, fin: Date): Promise<Cita[]>;
}
//# sourceMappingURL=ICitaRepository.d.ts.map