import express from "express";
import veiculoController from "../controllers/veiculoController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import validarSchema from "../middlewares/validarSchema.js";
import { veiculosSchemas } from "../schemas/veiculosSchemas.js";

const veiculoRouter = express.Router();

veiculoRouter.use(autenticarToken);
veiculoRouter.post("/", validarSchema(veiculosSchemas.criarVeiculoSchema, "body"), veiculoController.criar);
veiculoRouter.get("/", validarSchema(veiculosSchemas.listarVeiculosSchema, "query"), veiculoController.listar);
veiculoRouter.get("/:id", veiculoController.buscarPorId);
veiculoRouter.put("/:id", validarSchema(veiculosSchemas.atualizarVeiculoSchema, "body"), veiculoController.atualizar);
veiculoRouter.delete("/:id", veiculoController.deletar);

export default veiculoRouter;
