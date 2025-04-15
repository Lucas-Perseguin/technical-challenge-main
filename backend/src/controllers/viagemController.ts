import type { NextFunction, Request, Response } from "express";
import Motorista from "../models/Motorista.js";
import Veiculo from "../models/Veiculo.js";
import Viagem from "../models/Viagem.js";

async function criar(req: Request, res: Response, next: NextFunction) {
	try {
		const novaViagem = await Viagem.create(req.body);
		res.status(201).json(novaViagem);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function listar(req: Request, res: Response, next: NextFunction) {
	try {
		const { page = 1, limit = 20 } = req.query;
		const viagens = await Viagem.find({ ...req.query })
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 });
		const quantidade = await Viagem.countDocuments();
		res.json({
			viagens,
			paginasTotal: Math.ceil(quantidade / Number(limit)),
		});
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function buscarPorId(req: Request, res: Response, next: NextFunction) {
	try {
		const viagem = await Viagem.findById(req.params.id);
		if (!viagem) res.status(404).json({ erro: "Viagem não encontrada" });
		else {
			const [motorista, veiculo] = await Promise.all([
				Motorista.findOne({ _id: viagem.motorista }),
				Veiculo.findOne({ _id: viagem.veiculo }),
			]);
			res.json({ viagem, motorista, veiculo });
		}
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function atualizar(req: Request, res: Response, next: NextFunction) {
	try {
		const viagemAtualizada = await Viagem.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);
		if (!viagemAtualizada)
			res.status(404).json({ erro: "Viagem não encontrada" });
		else res.json(viagemAtualizada);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	try {
		const viagemRemovida = await Viagem.findByIdAndDelete(req.params.id);
		if (!viagemRemovida)
			res.status(404).json({ erro: "Viagem não encontrada" });
		else res.json({ mensagem: "Viagem removida com sucesso" });
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
};

export default viagemController;
