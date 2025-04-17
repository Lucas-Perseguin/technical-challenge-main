import express from "express";
import motoristaController from "../controllers/motoristaController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import { validacoesCriacaoMotorista } from "../middlewares/validacoesMotorista.js";
import validarSchema from "../middlewares/validarSchema.js";
import { motoristasSchemas } from "../schemas/motoristasSchemas.js";

const motoristaRouter = express.Router();

motoristaRouter.use(autenticarToken);
motoristaRouter.post(
	"/",
	validarSchema(motoristasSchemas.criarMotoristaSchema, "body"),
	validacoesCriacaoMotorista,
	motoristaController.criar,
);
motoristaRouter.get("/", validarSchema(motoristasSchemas.listarMotoristasSchema, "query"), motoristaController.listar);
motoristaRouter.get("/:id", motoristaController.buscarPorId);
motoristaRouter.put("/:id", validarSchema(motoristasSchemas.atualizarMotoristaSchema, "body"), motoristaController.atualizar);
motoristaRouter.delete("/:id", motoristaController.deletar);

export default motoristaRouter;
