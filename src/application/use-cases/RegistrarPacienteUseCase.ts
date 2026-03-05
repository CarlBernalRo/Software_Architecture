import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
import { Paciente } from "../../domain/entities/Paciente";

export class RegistrarPacienteUseCase {
    constructor(private readonly pacienteRepository: IPacienteRepository) { }

    async execute(data: { nombre: string; documento: string; correo: string }): Promise<Paciente> {
        const pacientes = await this.pacienteRepository.findAll();
        const existe = pacientes.find(p => p.documento === data.documento || p.correo === data.correo);

        if (existe) {
            throw new Error("Ya existe un paciente con ese documento o correo.");
        }

        return await this.pacienteRepository.save(data);
    }
}
