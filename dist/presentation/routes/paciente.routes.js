"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PacienteController_1 = require("../controllers/PacienteController");
const MysqlPacienteRepository_1 = require("../../infrastructure/repositories/MysqlPacienteRepository");
const RegistrarPacienteUseCase_1 = require("../../application/use-cases/RegistrarPacienteUseCase");
const router = (0, express_1.Router)();
// Dependencias
const repository = new MysqlPacienteRepository_1.MysqlPacienteRepository();
const registrarUseCase = new RegistrarPacienteUseCase_1.RegistrarPacienteUseCase(repository);
const controller = new PacienteController_1.PacienteController(repository, registrarUseCase);
// Rutas
router.post("/", controller.registrar.bind(controller));
router.get("/", controller.listar.bind(controller));
exports.default = router;
