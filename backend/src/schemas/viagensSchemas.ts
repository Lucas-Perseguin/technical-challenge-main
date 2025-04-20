import Joi from "joi";
import type { AtualizarViagemType, CriarViagemType, ListarViagensType } from "../types/viagemTypes.js";

const criarViagemSchema = Joi.object<CriarViagemType>({
	origem: Joi.string().min(3).max(60).required(),
	destino: Joi.string().min(3).max(60).required(),
	dataPartida: Joi.date().required(),
	previsaoChegada: Joi.date().required(),
	motorista: Joi.string().required(),
	veiculo: Joi.string().required(),
	status: Joi.string().valid("Planejada", "Em andamento", "Concluída", "Cancelada").required(),
}).required();

const atualizarViagemSchema = Joi.object<AtualizarViagemType>({
	origem: Joi.string().min(3).max(60).required(),
	destino: Joi.string().min(3).max(60).required(),
	dataPartida: Joi.date().required(),
	previsaoChegada: Joi.date().required(),
	motorista: Joi.string().required(),
	veiculo: Joi.string().required(),
	status: Joi.string().valid("Planejada", "Em andamento", "Concluída", "Cancelada").required(),
}).required();

const listarViagensSchema = Joi.object<ListarViagensType>({
	origem: Joi.string().min(3).max(60),
	destino: Joi.string().min(3).max(60),
	motorista: Joi.string().min(3).max(60),
	placa: Joi.string().min(2),
	status: Joi.string().valid("Planejada", "Em andamento", "Concluída", "Cancelada"),
	page: Joi.number(),
	limit: Joi.number(),
});

export const viagensSchemas = {
	criarViagemSchema,
	atualizarViagemSchema,
	listarViagensSchema,
};
