import { Request, Response } from "express";
import { AgendarCitaUseCase } from "../../application/use-cases/AgendarCitaUseCase";
import { CancelarCitaUseCase } from "../../application/use-cases/CancelarCitaUseCase";
import { ReprogramarCitaUseCase } from "../../application/use-cases/ReprogramarCitaUseCase";
import { ConsultarDisponibilidadUseCase } from "../../application/use-cases/ConsultarDisponibilidadUseCase";
import { CompletarCitaUseCase } from "../../application/use-cases/CompletarCitaUseCase";
import { ICitaRepository } from "../../domain/repositories/ICitaRepository";

export class CitaController {
    constructor(
        private citaRepository: ICitaRepository,
        private agendarUseCase: AgendarCitaUseCase,
        private cancelarUseCase: CancelarCitaUseCase,
        private reprogramarUseCase: ReprogramarCitaUseCase,
        private consultarUseCase: ConsultarDisponibilidadUseCase,
        private completarUseCase: CompletarCitaUseCase
    ) { }

    async agendar(req: Request, res: Response): Promise<void> {
        try {
            const { medicoId, pacienteId, fechaHora } = req.body;
            if (!medicoId || !pacienteId || !fechaHora) {
                res.status(400).json({ error: "medicoId, pacienteId y fechaHora son obligatorios." });
                return;
            }

            const cita = await this.agendarUseCase.execute(Number(medicoId), Number(pacienteId), new Date(fechaHora));
            res.status(201).json(cita);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async listar(req: Request, res: Response): Promise<void> {
        try {
            // Assuming this.citaRepository.findAll() or similar exists. Let's check ICitaRepository if needed or just use findAll.
            // Wait, we can just call it directly. The interface is ICitaRepository.
            const citas = await this.citaRepository.findAll();
            res.status(200).json(citas);
        } catch (error: any) {
            res.status(500).json({ error: "Error al obtener las citas" });
        }
    }

    async cancelar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.cancelarUseCase.execute(Number(id));
            res.status(200).json({ message: "Cita cancelada correctamente." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async completar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.completarUseCase.execute(Number(id));
            res.status(200).json({ message: "Cita completada correctamente." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async reprogramar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { fecha_hora, medico_id } = req.body;

            if (!fecha_hora || !medico_id) {
                res.status(400).json({ error: "fecha_hora y medico_id son obligatorios." });
                return;
            }

            const citaActualizada = await this.reprogramarUseCase.execute(Number(id), new Date(fecha_hora), Number(medico_id));
            res.status(200).json(citaActualizada);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async consultarDisponibilidad(req: Request, res: Response): Promise<void> {
        try {
            const { medicoId, fecha } = req.query;
            if (!medicoId || !fecha) {
                res.status(400).json({ error: "medicoId y fecha son obligatorios como parámetros de consulta." });
                return;
            }

            const huecos = await this.consultarUseCase.execute(Number(medicoId), fecha as string);
            res.status(200).json(huecos);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
