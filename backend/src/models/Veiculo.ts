import mongoose from "mongoose";

enum TipoVeiculo {
	Caminhao,
	Van,
	Carro,
	Caminhonete,
}

enum TipoCapacidade {
	Kilogramas,
	Litros,
}

export type VeiculoType = {
	_id: mongoose.Schema.Types.ObjectId;
	modelo: string;
	placa: string;
	tipoVeiculo: TipoVeiculo;
	tipoCapacidade: TipoCapacidade;
	capacidade: number;
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

const VeiculoSchema = new mongoose.Schema<VeiculoType>(
	{
		modelo: {
			type: String,
			required: true,
		},
		placa: {
			type: String,
			unique: true,
			required: true,
		},
		tipoVeiculo: {
			type: Number,
			required: true,
			min: 0,
			max: 3,
		},
		tipoCapacidade: {
			type: Number,
			required: true,
			min: 0,
			max: 1,
		},
		capacidade: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

const Veiculo = mongoose.model<VeiculoType>("Veiculo", VeiculoSchema);
export default Veiculo;
