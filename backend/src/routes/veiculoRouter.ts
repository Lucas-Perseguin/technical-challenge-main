import express from "express";
import veiculoController from "../controllers/veiculoController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";

const veiculoRouter = express.Router();

veiculoRouter.use(autenticarToken);
veiculoRouter.post("/", veiculoController.criar);
veiculoRouter.get("/", veiculoController.listar);
veiculoRouter.get("/:id", veiculoController.buscarPorId);
veiculoRouter.put("/:id", veiculoController.atualizar);
veiculoRouter.delete("/:id", veiculoController.deletar);

export default veiculoRouter;
