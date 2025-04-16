import express from "express";
import viagemController from "../controllers/viagemController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import {
	validacoesCriacaoViagem,
	validacoesGeraisViagem,
} from "../middlewares/validacoesViagem.js";

const viagemRouter = express.Router();

viagemRouter.use(autenticarToken);
viagemRouter.get("/", viagemController.listar);
viagemRouter.get("/:id", viagemController.buscarPorId);
viagemRouter.delete("/:id", viagemController.deletar);
viagemRouter.get("/motorista/:id", viagemController.listarViagensDoMotorista);
viagemRouter.use(validacoesGeraisViagem);
viagemRouter.post("/", validacoesCriacaoViagem, viagemController.criar);
viagemRouter.put("/:id", viagemController.atualizar);

export default viagemRouter;
