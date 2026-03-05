"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CitaController_1 = require("../controllers/CitaController");
const MysqlCitaRepository_1 = require("../../infrastructure/repositories/MysqlCitaRepository");
const MysqlMedicoRepository_1 = require("../../infrastructure/repositories/MysqlMedicoRepository");
const MysqlPacienteRepository_1 = require("../../infrastructure/repositories/MysqlPacienteRepository");
const AgendarCitaUseCase_1 = require("../../application/use-cases/AgendarCitaUseCase");
const CancelarCitaUseCase_1 = require("../../application/use-cases/CancelarCitaUseCase");
const ReprogramarCitaUseCase_1 = require("../../application/use-cases/ReprogramarCitaUseCase");
const ConsultarDisponibilidadUseCase_1 = require("../../application/use-cases/ConsultarDisponibilidadUseCase");
const router = (0, express_1.Router)();
// Dependencias
const citaRepo = new MysqlCitaRepository_1.MysqlCitaRepository();
const medicoRepo = new MysqlMedicoRepository_1.MysqlMedicoRepository();
const pacienteRepo = new MysqlPacienteRepository_1.MysqlPacienteRepository();
const agendarUC = new AgendarCitaUseCase_1.AgendarCitaUseCase(citaRepo, medicoRepo, pacienteRepo);
const cancelarUC = new CancelarCitaUseCase_1.CancelarCitaUseCase(citaRepo);
const reprogramarUC = new ReprogramarCitaUseCase_1.ReprogramarCitaUseCase(citaRepo);
const consultarUC = new ConsultarDisponibilidadUseCase_1.ConsultarDisponibilidadUseCase(citaRepo);
const controller = new CitaController_1.CitaController(citaRepo, agendarUC, cancelarUC, reprogramarUC, consultarUC);
// Rutas
router.post("/", controller.agendar.bind(controller));
router.patch("/:id/cancelar", controller.cancelar.bind(controller));
router.patch("/:id/reprogramar", controller.reprogramar.bind(controller));
router.get("/disponibilidad", controller.consultarDisponibilidad.bind(controller));
exports.default = router;
