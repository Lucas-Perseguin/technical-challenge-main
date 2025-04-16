import type { NextFunction, Request, Response } from "express";
import moment from "moment";
import Motorista from "../models/Motorista.js";

export async function validacoesGeraisViagem(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { motorista: motoristaId, dataPartida, previsaoChegada } = req.body;
	const motorista = await Motorista.findById(motoristaId);
	if (!motorista) {
		res.status(404).json({ erro: "Motorista não encontrado" });
		return;
	}

	if (moment(previsaoChegada).isSameOrBefore(dataPartida)) {
		res.status(400).json({
			erro: "A previsão de chegada não pode ser anterior ou igual à data de partida",
		});
		return;
	}

	if (moment(motorista.cnh.validade).isBefore(moment(previsaoChegada))) {
		res.status(400).json({
			erro: "A CNH do motorista escolhido estará vencida antes da previsão de chegada",
		});
		return;
	}

	next();
}

export async function validacoesCriacaoViagem(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { status, dataPartida } = req.body;

	if (status !== 0) {
		res
			.status(400)
			.json({ erro: "O status da viagem deve ser 'Planejada' na sua criação" });
		return;
	}

	if (moment(dataPartida).isBefore(moment.now())) {
		res.status(400).json({
			erro: "A data de partida não pode ser anterior ao momento atual",
		});
		return;
	}

	next();
}
