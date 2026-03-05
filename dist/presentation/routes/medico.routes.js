"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MedicoController_1 = require("../controllers/MedicoController");
const MysqlMedicoRepository_1 = require("../../infrastructure/repositories/MysqlMedicoRepository");
const RegistrarMedicoUseCase_1 = require("../../application/use-cases/RegistrarMedicoUseCase");
const router = (0, express_1.Router)();
// Dependencias
const repository = new MysqlMedicoRepository_1.MysqlMedicoRepository();
const registrarUseCase = new RegistrarMedicoUseCase_1.RegistrarMedicoUseCase(repository);
const controller = new MedicoController_1.MedicoController(repository, registrarUseCase);
// Rutas
router.post("/", controller.registrar.bind(controller));
router.get("/", controller.listar.bind(controller));
exports.default = router;
