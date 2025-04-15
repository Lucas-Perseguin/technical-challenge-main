import type { NextFunction, Request, Response } from "express";
import Veiculo from "../models/Veiculo.js";

async function criar(req: Request, res: Response, next: NextFunction) {
	try {
		const novoVeiculo = await Veiculo.create(req.body);
		res.status(201).json(novoVeiculo);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function listar(req: Request, res: Response, next: NextFunction) {
	try {
		const { page = 1, limit = 20 } = req.query;
		const veiculos = await Veiculo.find({ ...req.query })
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 });
		const quantidade = await Veiculo.countDocuments();
		res.json({ veiculos, paginasTotal: Math.ceil(quantidade / Number(limit)) });
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
		if (!veiculoAtualizado)
			res.status(404).json({ erro: "Veiculo não encontrado" });
		else res.json(veiculoAtualizado);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	try {
		const veiculoRemovido = await Veiculo.findByIdAndDelete(req.params.id);
		if (!veiculoRemovido)
			res.status(404).json({ erro: "Veiculo não encontrado" });
		else res.json({ mensagem: "Veiculo removido com sucesso" });
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
