import express from "express";
import viagemController from "../controllers/viagemController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";

const viagemRouter = express.Router();

viagemRouter.use(autenticarToken);
viagemRouter.post("/", viagemController.criar);
viagemRouter.get("/", viagemController.listar);
viagemRouter.get("/:id", viagemController.buscarPorId);
viagemRouter.put("/:id", viagemController.atualizar);
viagemRouter.delete("/:id", viagemController.deletar);

export default viagemRouter;
