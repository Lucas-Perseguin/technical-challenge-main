import type { CriarVeiculoType } from "@customTypes/veiculoTypes";
import { veiculoService } from "@services/veiculoService";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CadastrarVeiculo() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CriarVeiculoType>();

	async function cadastrarVeiculo(data: CriarVeiculoType) {
		try {
			await veiculoService.cadastrarVeiculo(data);
			toast.success("Veículo cadastrado com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	return (
		<div className="w-full flex flex-col items-center justify-center h-[calc(100vh-96px)] bg-gray-100">
			<form
				onSubmit={handleSubmit(cadastrarVeiculo)}
				className="flex flex-col md:grid md:grid-cols-2 max-w-[calc(100%-2rem)] text-gray-700 gap-4 md:gap-10"
			>
				<div>
					<label htmlFor="modelo" className="block text-sm/6 font-medium">
						Modelo
					</label>
					<input
						id="modelo"
						type="text"
						autoComplete="modelo"
						className="block w-80 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("modelo", {
							required: "Insira o modelo",
							minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
							maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.modelo?.message}</p>
				</div>
				<div>
					<label htmlFor="placa" className="block text-sm/6 font-medium">
						Placa
					</label>
					<input
						id="placa"
						type="text"
						autoComplete="placa"
						className="block w-80 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("placa", {
							required: "Insira a placa",
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.placa?.message}</p>
				</div>
				<div className="relative">
					<label htmlFor="tipoVeiculo" className="block text-sm/6 font-medium">
						Tipo do veículo
					</label>
					<select
						id="tipoVeiculo"
						autoComplete="tipoVeiculo"
						defaultValue=""
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("tipoVeiculo", {
							validate: (value) => {
								if (["Caminhão", "Carro", "Van", "Caminhonete"].includes(value)) {
									return true;
								}
								return "Selecione o tipo do veículo";
							},
						})}
					>
						<option className="">Selecionar</option>
						<option value="Caminhão">Caminhão</option>
						<option value="Carro">Carro</option>
						<option value="Van">Van</option>
						<option value="Caminhonete">Caminhonete</option>
					</select>
					<p className="text-red-700 text-sm text-nowrap absolute -bottom-5 left-0">{errors.tipoVeiculo?.message}</p>
				</div>
				<div className="flex w-full p-0 m-0 items-end flex-nowrap gap-1">
					<div className="w-full relative">
						<label htmlFor="capacidade" className="block text-sm/6 font-medium w-fit">
							Capacidade
						</label>
						<input
							id="capacidade"
							type="text"
							autoComplete="capacidade"
							className="block w-full h-9 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							{...register("capacidade", {
								required: "Insira a capacidade",
								minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
								maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
							})}
						/>
						<p className="text-red-700 text-sm text-nowrap absolute -bottom-5 left-0">{errors.capacidade?.message}</p>
					</div>
					<div className="w-fit relative">
						<select
							id="tipoCapacidade"
							autoComplete="tipoCapacidade"
							className="block w-fit h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							{...register("tipoCapacidade", { required: "Selecione o tipo da capacidade" })}
						>
							<option value="Kilogramas">Kg</option>
							<option value="Litros">L</option>
						</select>
						<p className="text-red-700 text-sm text-nowrap absolute -bottom-5 left-0">{errors.tipoCapacidade?.message}</p>
					</div>
				</div>
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2">
					Enviar
				</button>
			</form>
		</div>
	);
}
