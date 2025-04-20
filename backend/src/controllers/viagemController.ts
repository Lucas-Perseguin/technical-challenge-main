import type { NextFunction, Request, Response } from "express";
import type { PipelineStage } from "mongoose";
import mongoose from "mongoose";
import rabbit, { queue } from "../config/rabbit.js";
import Viagem from "../models/Viagem.js";

async function criar(req: Request, res: Response, next: NextFunction) {
	try {
		const novaViagem = await Viagem.create(req.body);
		rabbit.sendToQueue(queue, Buffer.from(JSON.stringify(novaViagem)));
		res.status(201).json(novaViagem);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function listar(req: Request, res: Response, next: NextFunction) {
	try {
		const { page = 1, limit = 10, motorista, placa } = req.query;

		const pipeline: PipelineStage[] = [
			{
				$lookup: {
					from: "motoristas",
					localField: "motorista",
					foreignField: "_id",
					as: "motoristaInfo",
				},
			},
			{
				$lookup: {
					from: "veiculos",
					localField: "veiculo",
					foreignField: "_id",
					as: "veiculoInfo",
				},
			},
			{
				$unwind: "$motoristaInfo",
			},
			{
				$unwind: "$veiculoInfo",
			},
		];

		const matchConditions: { [key: string]: { $regex: RegExp } } = {};

		if (motorista) {
			matchConditions["motoristaInfo.nome"] = { $regex: new RegExp(motorista as string, "i") };
		}

		if (placa) {
			matchConditions["veiculoInfo.placa"] = { $regex: new RegExp(placa as string, "i") };
		}

		for (const [key, value] of Object.entries(req.query)) {
			if (!["page", "limit", "motorista", "placa"].includes(key) && value) {
				matchConditions[key] = { $regex: new RegExp(value as string, "i") };
			}
		}

		if (Object.keys(matchConditions).length > 0) {
			pipeline.push({ $match: matchConditions });
		}

		const countResult = await Viagem.aggregate([...pipeline, { $count: "total" }]);
		const total = countResult[0]?.total || 0;

		pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) });

		const viagens = await Viagem.aggregate(pipeline);

		res.json({
			dados: viagens,
			paginacao: {
				paginasTotal: Math.ceil(total / Number(limit)),
				itensTotal: total,
			},
		});
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function buscarPorId(req: Request, res: Response, next: NextFunction) {
	try {
		const viagem = await Viagem.findById(req.params.id).populate("motorista").populate("veiculo");
		if (!viagem) res.status(404).json({ erro: "Viagem não encontrada" });
		else res.json(viagem);
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function atualizar(req: Request, res: Response, next: NextFunction) {
	try {
		const viagemAtualizada = await Viagem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!viagemAtualizada) res.status(404).json({ erro: "Viagem não encontrada" });
		else res.json(viagemAtualizada);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	try {
		const viagemRemovida = await Viagem.findByIdAndDelete(req.params.id);
		if (!viagemRemovida) res.status(404).json({ erro: "Viagem não encontrada" });
		else res.json({ mensagem: "Viagem removida com sucesso" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function listarViagensDoMotorista(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const { page = 1, limit = 10, placa } = req.query;

		const pipeline: PipelineStage[] = [
			{
				$match: {
					motorista: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$lookup: {
					from: "veiculos",
					localField: "veiculo",
					foreignField: "_id",
					as: "veiculoInfo",
				},
			},
			{
				$unwind: "$veiculoInfo",
			},
		];

		const matchConditions: { [key: string]: { $regex: RegExp } } = {};

		if (placa) {
			matchConditions["veiculoInfo.placa"] = { $regex: new RegExp(placa as string, "i") };
		}

		for (const [key, value] of Object.entries(req.query)) {
			if (!["page", "limit", "placa"].includes(key) && value) {
				matchConditions[key] = { $regex: new RegExp(value as string, "i") };
			}
		}

		if (Object.keys(matchConditions).length > 0) {
			pipeline.push({ $match: matchConditions });
		}

		const countResult = await Viagem.aggregate([...pipeline, { $count: "total" }]);
		const total = countResult[0]?.total || 0;

		pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) });

		const viagensDoMotorista = await Viagem.aggregate(pipeline);

		if (viagensDoMotorista.length === 0) {
			res.status(404).json({ erro: "Nenhuma viagem encontrada" });
		} else {
			res.json({
				dados: viagensDoMotorista,
				paginacao: {
					paginasTotal: Math.ceil(total / Number(limit)),
					itensTotal: total,
				},
			});
		}
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function listarViagensDoVeiculo(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const { page = 1, limit = 10, motorista } = req.query;

		const pipeline: PipelineStage[] = [
			{
				$match: {
					veiculo: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$lookup: {
					from: "motoristas",
					localField: "motorista",
					foreignField: "_id",
					as: "motoristaInfo",
				},
			},
			{
				$unwind: "$motoristaInfo",
			},
		];

		const matchConditions: { [key: string]: { $regex: RegExp } } = {};

		if (motorista) {
			matchConditions["motoristaInfo.nome"] = { $regex: new RegExp(motorista as string, "i") };
		}

		for (const [key, value] of Object.entries(req.query)) {
			if (!["page", "limit", "motorista"].includes(key) && value) {
				matchConditions[key] = { $regex: new RegExp(value as string, "i") };
			}
		}

		if (Object.keys(matchConditions).length > 0) {
			pipeline.push({ $match: matchConditions });
		}

		const countResult = await Viagem.aggregate([...pipeline, { $count: "total" }]);
		const total = countResult[0]?.total || 0;

		pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) });

		const viagensDoVeiculo = await Viagem.aggregate(pipeline);

		if (viagensDoVeiculo.length === 0) {
			res.status(404).json({ erro: "Nenhuma viagem encontrada" });
		} else {
			res.json({
				dados: viagensDoVeiculo,
				paginacao: {
					paginasTotal: Math.ceil(total / Number(limit)),
					itensTotal: total,
				},
			});
		}
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

const viagemController = {
	criar,
	listar,
	buscarPorId,
	atualizar,
	deletar,
	listarViagensDoMotorista,
	listarViagensDoVeiculo,
};

export default viagemController;
