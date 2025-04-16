import express from "express";
import motoristaController from "../controllers/motoristaController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import { validacoesCriacaoMotorista } from "../middlewares/validacoesMotorista.js";

const motoristaRouter = express.Router();

motoristaRouter.use(autenticarToken);
motoristaRouter.post(
	"/",
	validacoesCriacaoMotorista,
	motoristaController.criar,
);
motoristaRouter.get("/", motoristaController.listar);
motoristaRouter.get("/:id", motoristaController.buscarPorId);
motoristaRouter.put("/:id", motoristaController.atualizar);
motoristaRouter.delete("/:id", motoristaController.deletar);

export default motoristaRouter;
