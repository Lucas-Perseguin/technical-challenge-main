import express from "express";
import viagemController from "../controllers/viagemController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import { validacoesGeraisViagem } from "../middlewares/validacoesViagem.js";
import validarSchema from "../middlewares/validarSchema.js";
import { viagensSchemas } from "../schemas/viagensSchemas.js";

const viagemRouter = express.Router();

viagemRouter.use(autenticarToken);
viagemRouter.get("/", validarSchema(viagensSchemas.listarViagensSchema, "query"), viagemController.listar);
viagemRouter.get("/:id", viagemController.buscarPorId);
viagemRouter.delete("/:id", viagemController.deletar);
viagemRouter.get("/motorista/:id", viagemController.listarViagensDoMotorista);
viagemRouter.get("/veiculo/:id", viagemController.listarViagensDoVeiculo);
viagemRouter.post("/", validarSchema(viagensSchemas.criarViagemSchema, "body"), validacoesGeraisViagem, viagemController.criar);
viagemRouter.put(
	"/:id",
	validarSchema(viagensSchemas.atualizarViagemSchema, "body"),
	validacoesGeraisViagem,
	viagemController.atualizar,
);

export default viagemRouter;
