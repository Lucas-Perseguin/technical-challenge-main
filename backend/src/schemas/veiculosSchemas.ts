import Joi from "joi";
import type { AtualizarVeiculoType, CriarVeiculoType, ListarVeiculosType } from "../types/veiculoTypes.js";

const criarVeiculoSchema = Joi.object<CriarVeiculoType>({
	modelo: Joi.string().min(3).max(60).required(),
	placa: Joi.string().min(6).max(12).required(),
	tipoVeiculo: Joi.string().valid("Caminhão", "Carro", "Van", "Caminhonete").required(),
	tipoCapacidade: Joi.string().valid("Kilogramas", "Litros").required(),
	capacidade: Joi.number().min(0).required(),
});

const atualizarVeiculoSchema = Joi.object<AtualizarVeiculoType>({
	modelo: Joi.string().min(3).max(60).required(),
	tipoVeiculo: Joi.string().valid("Caminhão", "Carro", "Van", "Caminhonete").required(),
	tipoCapacidade: Joi.string().valid("Kilogramas", "Litros").required(),
	capacidade: Joi.number().min(0).required(),
});

const listarVeiculosSchema = Joi.object<ListarVeiculosType>({
	modelo: Joi.string().min(3).max(60),
	placa: Joi.string().min(6).max(12),
	tipoVeiculo: Joi.string().valid("Caminhão", "Carro", "Van", "Caminhonete"),
	page: Joi.string(),
	limit: Joi.string(),
});

export const veiculosSchemas = {
	criarVeiculoSchema,
	atualizarVeiculoSchema,
	listarVeiculosSchema,
};
