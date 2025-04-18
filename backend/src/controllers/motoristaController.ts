import type { NextFunction, Request, Response } from "express";
import redis from "../config/redis.js";
import Motorista from "../models/Motorista.js";
import { deletarKeys } from "../utils/redis.js";

async function criar(req: Request, res: Response, next: NextFunction) {
	try {
		const cpf = req.body.cpf.replace(/[^0-9]/g, "");
		const novoMotorista = await Motorista.create({ ...req.body, cpf });
		deletarKeys("motoristas:*");
		res.status(201).json(novoMotorista);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function listar(req: Request, res: Response, next: NextFunction) {
	try {
		const { page = 1, limit = 10 } = req.query;
		const objetoQuery: { [key: string]: { $regex: RegExp } } = {};
		for (const [key, value] of Object.entries(req.query)) {
			if (key !== "page" && key !== "limit" && value) objetoQuery[key] = { $regex: new RegExp(value as string, "i") };
		}
		const redisKey = `motoristas:${JSON.stringify({ ...objetoQuery, page, limit })}`;
		const quantidade = await Motorista.countDocuments(objetoQuery);
		const listaRedis = await redis.get(redisKey);
		if (listaRedis) {
			res.json({
				dados: JSON.parse(listaRedis),
				paginacao: {
					paginasTotal: Math.ceil(quantidade / Number(limit)),
					itensTotal: quantidade,
				},
			});
			return;
		}
		const motoristas = await Motorista.find(objetoQuery)
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 });
		redis.set(redisKey, JSON.stringify(motoristas));
		res.json({
			dados: motoristas,
			paginacao: {
				paginasTotal: Math.ceil(quantidade / Number(limit)),
				itensTotal: quantidade,
			},
		});
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function buscarPorId(req: Request, res: Response, next: NextFunction) {
	try {
		const motorista = await Motorista.findById(req.params.id);
		if (!motorista) res.status(404).json({ erro: "Motorista não encontrado" });
		else res.json(motorista);
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function atualizar(req: Request, res: Response, next: NextFunction) {
	try {
		const motoristaAtualizado = await Motorista.findByIdAndUpdate(
			req.params.id,
			{
				$set: { nome: req.body.nome, "cnh.validade": req.body.cnh.validade },
			},
			{ new: true, runValidators: true },
		);
		if (!motoristaAtualizado) res.status(404).json({ erro: "Motorista não encontrado" });
		else {
			deletarKeys("motoristas:*");
			res.json(motoristaAtualizado);
		}
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	try {
		const motoristaRemovido = await Motorista.findByIdAndDelete(req.params.id);
		if (!motoristaRemovido) res.status(404).json({ erro: "Motorista não encontrado" });
		else {
			deletarKeys("motoristas:*");
			res.json({ mensagem: "Motorista removido com sucesso" });
		}
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

const motoristaController = {
	criar,
	listar,
	buscarPorId,
	atualizar,
	deletar,
};

export default motoristaController;
