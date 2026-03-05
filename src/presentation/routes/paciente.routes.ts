import { Router } from "express";
import { PacienteController } from "../controllers/PacienteController";
import { MysqlPacienteRepository } from "../../infrastructure/repositories/MysqlPacienteRepository";
import { RegistrarPacienteUseCase } from "../../application/use-cases/RegistrarPacienteUseCase";

const router = Router();

// Dependencias
const repository = new MysqlPacienteRepository();
const registrarUseCase = new RegistrarPacienteUseCase(repository);
const controller = new PacienteController(repository, registrarUseCase);

// Rutas
router.post("/", controller.registrar.bind(controller));
router.get("/", controller.listar.bind(controller));

export default router;
