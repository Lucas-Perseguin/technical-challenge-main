import type { NextFunction, Request, Response } from "express";
import moment from "moment";

export async function validacoesCriacaoMotorista(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { cnh } = req.body;

	if (moment(cnh.validade).isSameOrBefore(moment.now())) {
		res.status(400).json({ erro: "A CNH do motorista está vencida" });
		return;
	}

	next();
}
