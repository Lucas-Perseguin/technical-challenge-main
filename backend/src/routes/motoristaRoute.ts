import express from "express";
import motoristaController from "../controllers/motoristaController.js";

const motoristaRouter = express.Router();

motoristaRouter.post("/", motoristaController.criar);
motoristaRouter.get("/", motoristaController.listar);
motoristaRouter.get("/:id", motoristaController.buscarPorId);
motoristaRouter.put("/:id", motoristaController.atualizar);
motoristaRouter.delete("/:id", motoristaController.deletar);

export default motoristaRouter;
