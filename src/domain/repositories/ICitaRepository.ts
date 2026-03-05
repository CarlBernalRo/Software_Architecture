import { Cita } from "../entities/Cita";

export interface ICitaRepository {
    findById(id: number): Promise<Cita | null>;
    save(cita: Omit<Cita, 'id'>): Promise<Cita>;
    update(cita: Cita): Promise<void>;

    // Consultas específicas
    findActivasByMedicoAndDate(medicoId: number, fecha: Date): Promise<Cita[]>;
    findByMedicoAndDateRange(medicoId: number, inicio: Date, fin: Date): Promise<Cita[]>;
}
