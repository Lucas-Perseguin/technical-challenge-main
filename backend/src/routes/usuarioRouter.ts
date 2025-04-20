import { Router } from "express";
import usuarioController from "../controllers/usuarioController.js";
import { autenticarToken } from "../middlewares/autenticacaoMiddleware.js";
import { validacoesCriacaoAdmin } from "../middlewares/validacoesUsuario.js";
import validarSchema from "../middlewares/validarSchema.js";
import { usuariosSchemas } from "../schemas/usuariosSchemas.js";

const usuarioRouter = Router();

usuarioRouter.post("/login", validarSchema(usuariosSchemas.logarUsuarioSchema, "body"), usuarioController.logar);
usuarioRouter.post("/", validarSchema(usuariosSchemas.criarUsuarioSchema, "body"), usuarioController.criar);
usuarioRouter.use(autenticarToken);
usuarioRouter.get("/token", usuarioController.buscarUsuarioPorToken);
usuarioRouter.get("/", validarSchema(usuariosSchemas.listarUsuariosSchema, "query"), usuarioController.listar);
usuarioRouter.get("/:id", usuarioController.buscarPorId);
usuarioRouter.put("/:id", validarSchema(usuariosSchemas.atualizarUsuarioSchema, "body"), usuarioController.atualizar);
usuarioRouter.delete("/:id", usuarioController.deletar);
usuarioRouter.post(
	"/admin",
	validarSchema(usuariosSchemas.criarUsuarioSchema, "body"),
	validacoesCriacaoAdmin,
	usuarioController.criar,
);

export default usuarioRouter;
