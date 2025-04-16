import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import { validacoesCriacaoAdmin } from "../middlewares/validacoesUsuario.js";

const usuarioRouter = Router();

usuarioRouter.post("/login", usuarioController.logar);
usuarioRouter.post("/", usuarioController.criar);
usuarioRouter.use(autenticarToken);
usuarioRouter.get("/", usuarioController.listar);
usuarioRouter.get("/:id", usuarioController.buscarPorId);
usuarioRouter.put("/:id", usuarioController.atualizar);
usuarioRouter.delete("/:id", usuarioController.deletar);
usuarioRouter.post("/admin", validacoesCriacaoAdmin, usuarioController.criar);

export default usuarioRouter;
