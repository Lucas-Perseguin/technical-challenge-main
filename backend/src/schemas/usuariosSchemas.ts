import Joi from "joi";
import type { AtualizarUsuarioType, CriarUsuarioType, ListarUsuariosType, LogarUsuarioType } from "../types/usuarioTypes.js";
import { validarCPF } from "../utils/schemas.js";

const criarUsuarioSchema = Joi.object<CriarUsuarioType>({
	nome: Joi.string().min(3).max(60).required(),
	email: Joi.string().email().required(),
	cpf: Joi.string().custom(validarCPF).required(),
	senha: Joi.string().min(4).max(40).required(),
	admin: Joi.bool().required(),
}).required();

const logarUsuarioSchema = Joi.object<LogarUsuarioType>({
	cpf: Joi.string().custom(validarCPF).required(),
	senha: Joi.string().min(4).max(40).required(),
}).required();

const atualizarUsuarioSchema = Joi.object<AtualizarUsuarioType>({
	nome: Joi.string().min(3).max(60).required(),
	email: Joi.string().email().required(),
}).required();

const listarUsuariosSchema = Joi.object<ListarUsuariosType>({
	cpf: Joi.string().custom(validarCPF),
	nome: Joi.string().min(3).max(60),
	email: Joi.string().email(),
	page: Joi.string(),
	limit: Joi.string(),
});

export const usuariosSchemas = {
	criarUsuarioSchema,
	logarUsuarioSchema,
	atualizarUsuarioSchema,
	listarUsuariosSchema,
};
