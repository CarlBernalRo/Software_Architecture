import { Request, Response } from "express";
import { AgendarCitaUseCase } from "../../application/use-cases/AgendarCitaUseCase";
import { CancelarCitaUseCase } from "../../application/use-cases/CancelarCitaUseCase";
import { ReprogramarCitaUseCase } from "../../application/use-cases/ReprogramarCitaUseCase";
import { ConsultarDisponibilidadUseCase } from "../../application/use-cases/ConsultarDisponibilidadUseCase";
import { ICitaRepository } from "../../domain/repositories/ICitaRepository";

export class CitaController {
    constructor(
        private citaRepository: ICitaRepository,
        private agendarUseCase: AgendarCitaUseCase,
        private cancelarUseCase: CancelarCitaUseCase,
        private reprogramarUseCase: ReprogramarCitaUseCase,
        private consultarUseCase: ConsultarDisponibilidadUseCase
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

    async cancelar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.cancelarUseCase.execute(Number(id));
            res.status(200).json({ message: "Cita cancelada correctamente." });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async reprogramar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nuevaFechaHora } = req.body;

            if (!nuevaFechaHora) {
                res.status(400).json({ error: "nuevaFechaHora es obligatorio." });
                return;
            }

            await this.reprogramarUseCase.execute(Number(id), new Date(nuevaFechaHora));
            res.status(200).json({ message: "Cita reprogramada correctamente." });
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

            const huecos = await this.consultarUseCase.execute(Number(medicoId), new Date(fecha as string));
            res.status(200).json({ huecosDisponibles: huecos });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
