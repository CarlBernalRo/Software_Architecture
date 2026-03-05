import { Router } from "express";
import { MedicoController } from "../controllers/MedicoController";
import { MysqlMedicoRepository } from "../../infrastructure/repositories/MysqlMedicoRepository";
import { RegistrarMedicoUseCase } from "../../application/use-cases/RegistrarMedicoUseCase";

const router = Router();

// Dependencias
const repository = new MysqlMedicoRepository();
const registrarUseCase = new RegistrarMedicoUseCase(repository);
const controller = new MedicoController(repository, registrarUseCase);

// Rutas
router.post("/", controller.registrar.bind(controller));
router.get("/", controller.listar.bind(controller));

export default router;
