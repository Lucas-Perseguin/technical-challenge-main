import Joi from "joi";
import type { AtualizarMotoristaType, CriarMotoristaType, ListarMotoristasType } from "../types/motoristaTypes.js";
import { validarCNH, validarCPF } from "../utils/schemas.js";

const criarMotoristaSchema = Joi.object<CriarMotoristaType>({
	nome: Joi.string().min(3).max(60).required(),
	cpf: Joi.string().custom(validarCPF).required(),
	cnh: Joi.object({
		validade: Joi.date().required(),
		numero: Joi.string().custom(validarCNH).required(),
	}).required(),
});

const atualizarMotoristaSchema = Joi.object<AtualizarMotoristaType>({
	nome: Joi.string().min(3).max(60).required(),
	cnh: Joi.object({
		validade: Joi.date().required(),
	}).required(),
});

const listarMotoristasSchema = Joi.object<ListarMotoristasType>({
	nome: Joi.string().min(3).max(60),
	cpf: Joi.string().custom(validarCPF),
	cnh: Joi.object({
		numero: Joi.string().custom(validarCNH),
	}),
	page: Joi.string(),
	limit: Joi.string(),
});

export const motoristasSchemas = {
	criarMotoristaSchema,
	atualizarMotoristaSchema,
	listarMotoristasSchema,
};
