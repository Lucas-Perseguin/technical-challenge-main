import Bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { SignJWT } from "jose";
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
		res.status(201).json({ ...novoUsuario.toObject(), senha: undefined });
	} catch (error: any) {
		res.status(400).json({ erro: error.message });
	}
}

async function listar(req: Request, res: Response, next: NextFunction) {
	if (!req.app.locals.admin) {
		res.status(403).json({ erro: "Permissão negada" });
		return;
	}
	try {
		const { page = 1, limit = 10 } = req.query;
		const objetoQuery: { [key: string]: { $regex: RegExp } } = {};
		for (const [key, value] of Object.entries(req.query)) {
			if (key !== "page" && key !== "limit" && value) objetoQuery[key] = { $regex: new RegExp(value as string, "i") };
		}
		const usuarios = await Usuario.find(objetoQuery)
			.select(["_id", "cpf", "email", "nome"])
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 });
		const quantidade = await Usuario.countDocuments(objetoQuery);
		res.json({
			dados: usuarios,
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
		const usuario = await Usuario.findById(req.params.id).select(["_id", "cpf", "email", "nome"]);
		if (usuario) res.json(usuario);
		else res.status(404).json({ erro: "Usuário não encontrado" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function atualizar(req: Request, res: Response, next: NextFunction) {
	if (req.params.id !== req.app.locals._id && !req.app.locals.admin) {
		res.status(403).json({ erro: "Permissão negada" });
		return;
	}
	try {
		const usuario = await Usuario.findById(req.params.id).select(["_id", "nome", "cpf", "email", "admin"]);
		if (usuario) {
			if (req.params.id !== req.app.locals._id && usuario.admin) {
				res.status(403).json({ erro: "Permissão negada" });
				return;
			}
			const erros = usuario.$set({ nome: req.body.nome, email: req.body.email }).validateSync();
			if (erros) {
				res.status(400).json({ erro: erros });
				return;
			}
			await usuario.save();
			res.json(usuario);
			return;
		}
		res.status(404).json({ erro: "Usuário não encontrado" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function deletar(req: Request, res: Response, next: NextFunction) {
	if (req.params.id !== req.app.locals._id && !req.app.locals.admin) {
		res.status(403).json({ erro: "Permissão negada" });
		return;
	}
	try {
		const usuario = await Usuario.findById(req.params.id);
		if (usuario) {
			if (req.params.id !== req.app.locals._id && usuario.admin) {
				res.status(403).json({ erro: "Permissão negada" });
				return;
			}
			await Usuario.findByIdAndDelete(req.params.id);
			res.status(200).json("Usuário removido com sucesso");
		} else res.status(404).json({ erro: "Usuário não encontrado" });
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function logar(req: Request, res: Response, next: NextFunction) {
	try {
		const usuario = await Usuario.findOne({
			cpf: req.body.cpf.replace(/[^0-9]/g, ""),
		});
		if (!usuario || !Bcrypt.compareSync(req.body.senha, usuario.senha))
			res.status(404).json({ erro: "Usuário e/ou senha incorretos" });
		else {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const alg = "HS256";
			const token = await new SignJWT({ _id: usuario.id, admin: usuario.admin })
				.setProtectedHeader({ alg })
				.setExpirationTime("7d")
				.sign(secret);
			res.json({ token });
		}
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
}

async function buscarUsuarioPorToken(req: Request, res: Response, next: NextFunction) {
	try {
		const usuario = await Usuario.findById(req.app.locals._id).select(["_id", "nome", "cpf", "email"]);
		if (!usuario) {
			res.status(404).json({ erro: "Usuário não encontrado" });
			return;
		}

		res.json(usuario);
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
	logar,
	buscarUsuarioPorToken,
};
export default usuarioController;
