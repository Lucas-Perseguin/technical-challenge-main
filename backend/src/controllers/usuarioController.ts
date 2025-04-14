import Bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import Usuario from "../models/Usuario.js";

async function criar(req: Request, res: Response, next: NextFunction) {
	try {
		const senhaHash = Bcrypt.hashSync(req.body.senha, 12);
		const cpf = req.body.cpf.replace(/[^0-9]/g, "");
		const novoUsuario = await Usuario.create({
			...req.body,
			senha: senhaHash,
			cpf,
		});
		res.status(201).json(novoUsuario);
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function listar(req: Request, res: Response, next: NextFunction) {
	try {
		const usuarios = await Usuario.find();
		res.json(usuarios);
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function buscarPorId(req: Request, res: Response, next: NextFunction) {
	try {
		const usuario = await Usuario.findById(req.params.id);
		if (usuario) res.json(usuario);
		else res.status(404).json({ erro: "Usuário não encontrado" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function atualizar(req: Request, res: Response, next: NextFunction) {
	try {
		const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (usuario) res.json(usuario);
		else res.status(404).json({ erro: "Usuário não encontrado" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	try {
		const usuario = await Usuario.findByIdAndDelete(req.params.id);
		if (usuario) res.status(200).json("Usuário romvido com sucesso");
		else res.status(404).json({ erro: "Usuário não encontrado" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

const usuarioController = {
	criar,
	listar,
	buscarPorId,
	atualizar,
	deletar,
};
export default usuarioController;
