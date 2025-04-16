import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";

export async function autenticarToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.header("Authorization");
	if (!authHeader) {
		res.sendStatus(400);
		return;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		res.sendStatus(400);
		return;
	}

	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const resultado = await jwtVerify(token, secret);
		if (!resultado.payload._id) {
			res.sendStatus(400);
			return;
		}

		req.app.locals._id = resultado.payload._id;
		req.app.locals.admin = resultado.payload.admin;
		next();
	} catch (err) {
		res.sendStatus(401);
	}
}
