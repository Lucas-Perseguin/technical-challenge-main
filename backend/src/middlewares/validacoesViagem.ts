import type { NextFunction, Request, Response } from "express";
import moment from "moment";
import Motorista from "../models/Motorista.js";
import Veiculo from "../models/Veiculo.js";

export async function validacoesGeraisViagem(req: Request, res: Response, next: NextFunction) {
	const { dataPartida, previsaoChegada, motorista: motoristaId, veiculo: veiculoId, status } = req.body;
	const partida = moment(dataPartida);
	const chegada = moment(previsaoChegada);
	const hoje = moment().milliseconds(0).seconds(0).minutes(0).hours(9);
	if (chegada.isBefore(partida)) {
		res.status(400).json({
			erro: "A previsão de chegada não pode ser anterior à data de partida",
		});
		return;
	}

	if (status === "Planejada" && partida.isBefore(hoje)) {
		res.status(400).json({ erro: "A data de partida não pode ser anterior à data de hoje para viagens planejadas" });
	}

	if ((status === "Em andamento" || status === "Concluída") && partida.isAfter(hoje)) {
		res
			.status(400)
			.json({ erro: "A data de partida não pode ser posterior à data de hoje para viagens em andamento ou concluídas" });
	}

	const motorista = await Motorista.findById(motoristaId);
	if (!motorista) {
		res.status(404).json({ erro: "Motorista não encontrado" });
		return;
	}

	if (moment(motorista.cnh.validade).isBefore(moment(previsaoChegada))) {
		res.status(400).json({
			erro: "A CNH do motorista escolhido estará vencida antes da previsão de chegada",
		});
		return;
	}

	const veiculo = await Veiculo.findById(veiculoId);
	if (!veiculo) {
		res.status(404).json({ erro: "Veículo não encontrado" });
		return;
	}

	next();
}
