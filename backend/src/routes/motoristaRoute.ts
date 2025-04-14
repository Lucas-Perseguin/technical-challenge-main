import express from "express";
import motoristaController from "../controllers/motoristaController";

const router = express.Router();

router.post("/", motoristaController.criar);
router.get("/", motoristaController.listar);
router.get("/:id", motoristaController.buscarPorId);
router.put("/:id", motoristaController.atualizar);
router.delete("/:id", motoristaController.deletar);

export default router;
