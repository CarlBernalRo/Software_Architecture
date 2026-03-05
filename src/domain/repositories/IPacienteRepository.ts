import { Paciente } from "../entities/Paciente";

export interface IPacienteRepository {
    findById(id: number): Promise<Paciente | null>;
    save(paciente: Omit<Paciente, 'id'>): Promise<Paciente>;
    findAll(): Promise<Paciente[]>;
}
