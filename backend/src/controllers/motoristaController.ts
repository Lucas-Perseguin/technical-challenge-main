import type { NextFunction, Request, Response } from "express";
import Motorista from "../models/Motorista.js";

const criar = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const novoMotorista = await Motorista.create(req.body);
		res.status(201).json(novoMotorista);
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
};

const listar = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const motoristas = await Motorista.find();
		res.json(motoristas);
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
};

const buscarPorId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const motorista = await Motorista.findById(req.params.id);
		if (!motorista) res.status(404).json({ erro: "Motorista não encontrado" });
		else res.json(motorista);
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
};

const atualizar = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const motoristaAtualizado = await Motorista.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);
		if (!motoristaAtualizado)
			res.status(404).json({ erro: "Motorista não encontrado" });
		else res.json(motoristaAtualizado);
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
};

const deletar = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const motoristaRemovido = await Motorista.findByIdAndDelete(req.params.id);
		if (!motoristaRemovido)
			res.status(404).json({ erro: "Motorista não encontrado" });
		else res.json({ mensagem: "Motorista removido com sucesso" });
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
};

const motoristaController = {
	criar,
	listar,
	buscarPorId,
	atualizar,
	deletar,
};

export default motoristaController;
