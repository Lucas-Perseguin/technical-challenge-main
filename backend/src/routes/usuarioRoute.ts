import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";

const usuarioRouter = Router();

usuarioRouter.post("/", usuarioController.criar);
usuarioRouter.get("/", usuarioController.listar);
usuarioRouter.get("/:id", usuarioController.buscarPorId);
usuarioRouter.put("/:id", usuarioController.atualizar);
usuarioRouter.delete("/:id", usuarioController.deletar);

export default usuarioRouter;
