import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
import { Medico } from "../../domain/entities/Medico";

export class RegistrarMedicoUseCase {
    constructor(private readonly medicoRepository: IMedicoRepository) { }

    async execute(data: { nombre: string; especialidad: string; licencia: string }): Promise<Medico> {
        const medicos = await this.medicoRepository.findAll();
        const existe = medicos.find(m => m.licencia === data.licencia);

        if (existe) {
            throw new Error("Ya existe un médico con esa licencia.");
        }

        return await this.medicoRepository.save(data);
    }
}
