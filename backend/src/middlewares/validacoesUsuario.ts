import type { NextFunction, Request, Response } from "express";

export async function validacoesCriacaoAdmin(req: Request, res: Response, next: NextFunction) {
	const { admin } = req.app.locals;
	if (!admin) {
		res.status(403).json({ erro: "Permissão negada" });
		return;
	}

	req.body.admin = true;
	next();
}
