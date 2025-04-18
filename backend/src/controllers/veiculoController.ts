import type { NextFunction, Request, Response } from "express";
import redis from "../config/redis.js";
import Veiculo from "../models/Veiculo.js";
import { deletarKeys } from "../utils/redis.js";

async function criar(req: Request, res: Response, next: NextFunction) {
	try {
		const novoVeiculo = await Veiculo.create(req.body);
		deletarKeys("veiculos:*");
		res.status(201).json(novoVeiculo);
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
		const redisKey = `veiculos:${JSON.stringify({ ...objetoQuery, page, limit })}`;
		const quantidade = await Veiculo.countDocuments();
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
		const veiculos = await Veiculo.find(objetoQuery)
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 });
		redis.set(redisKey, JSON.stringify(veiculos));
		res.json({
			dados: veiculos,
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
		const veiculo = await Veiculo.findById(req.params.id);
		if (!veiculo) res.status(404).json({ erro: "Veiculo não encontrado" });
		else res.json(veiculo);
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function atualizar(req: Request, res: Response, next: NextFunction) {
	try {
		const veiculoAtualizado = await Veiculo.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					modelo: req.body.modelo,
					tipoVeiculo: req.body.tipoVeiculo,
					tipoCapacidade: req.body.tipoCapacidade,
					capacidade: req.body.capacidade,
				},
			},
			{ new: true, runValidators: true },
		);
		if (!veiculoAtualizado) res.status(404).json({ erro: "Veiculo não encontrado" });
		else {
			deletarKeys("veiculos:*");
			res.json(veiculoAtualizado);
		}
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	try {
		const veiculoRemovido = await Veiculo.findByIdAndDelete(req.params.id);
		if (!veiculoRemovido) res.status(404).json({ erro: "Veiculo não encontrado" });
		else {
			deletarKeys("veiculos:*");
			res.json({ mensagem: "Veiculo removido com sucesso" });
		}
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

const veiculoController = {
	criar,
	listar,
	buscarPorId,
	atualizar,
	deletar,
};

export default veiculoController;
