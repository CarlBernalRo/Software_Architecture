import { Router } from "express";
import { CitaController } from "../controllers/CitaController";
import { MysqlCitaRepository } from "../../infrastructure/repositories/MysqlCitaRepository";
import { MysqlMedicoRepository } from "../../infrastructure/repositories/MysqlMedicoRepository";
import { MysqlPacienteRepository } from "../../infrastructure/repositories/MysqlPacienteRepository";
import { AgendarCitaUseCase } from "../../application/use-cases/AgendarCitaUseCase";
import { CancelarCitaUseCase } from "../../application/use-cases/CancelarCitaUseCase";
import { ReprogramarCitaUseCase } from "../../application/use-cases/ReprogramarCitaUseCase";
import { ConsultarDisponibilidadUseCase } from "../../application/use-cases/ConsultarDisponibilidadUseCase";

const router = Router();

// Dependencias
const citaRepo = new MysqlCitaRepository();
const medicoRepo = new MysqlMedicoRepository();
const pacienteRepo = new MysqlPacienteRepository();

const agendarUC = new AgendarCitaUseCase(citaRepo, medicoRepo, pacienteRepo);
const cancelarUC = new CancelarCitaUseCase(citaRepo);
const reprogramarUC = new ReprogramarCitaUseCase(citaRepo);
const consultarUC = new ConsultarDisponibilidadUseCase(citaRepo);

const controller = new CitaController(citaRepo, agendarUC, cancelarUC, reprogramarUC, consultarUC);

// Rutas
router.post("/", controller.agendar.bind(controller));
router.patch("/:id/cancelar", controller.cancelar.bind(controller));
router.patch("/:id/reprogramar", controller.reprogramar.bind(controller));
router.get("/disponibilidad", controller.consultarDisponibilidad.bind(controller));

export default router;
