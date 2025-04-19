import type { CriarVeiculoType } from "@customTypes/veiculoTypes";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { veiculoService } from "@services/veiculoService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function BuscarVeiculo() {
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CriarVeiculoType>();

	const [valor, setValor] = useState<string>(id || "");

	async function buscarVeiculo(id: string) {
		try {
			const { data: resposta } = await veiculoService.buscarVeiculo(id);
			reset(resposta);
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	async function editarVeiculo(data: CriarVeiculoType) {
		try {
			await veiculoService.editarVeiculo(
				{ modelo: data.modelo, tipoVeiculo: data.tipoVeiculo, capacidade: data.capacidade, tipoCapacidade: data.tipoCapacidade },
				valor,
			);
			toast.success("Dados do veiculo atualizados com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	useEffect(() => {
		if (id) {
			buscarVeiculo(id);
		}
	}, [id]);

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<p className="text-xl md:text-2xl font-semibold mb-5">Visualizar e editar veículo</p>
			<div className="max-w-[calc(100%-2rem)] w-60 relative">
				<label htmlFor="nome" className="block text-sm/6 font-medium">
					ID do veículo
				</label>
				<input
					id="nome"
					type="text"
					autoComplete="nome"
					value={valor}
					onChange={(e) => setValor(e.target.value)}
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
				/>
				<MagnifyingGlassCircleIcon
					onClick={() => buscarVeiculo(valor)}
					className={`${valor.length === 24 ? "text-blue-600 cursor-pointer" : "text-gray-700"} size-8 absolute top-6 right-0`}
				/>
			</div>
			<form
				onSubmit={handleSubmit(editarVeiculo)}
				className="flex flex-col md:grid md:grid-cols-2 max-w-[calc(100%-2rem)] text-gray-700 gap-4 md:gap-10 mt-14"
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
						disabled
						className="block w-80 max-w-full rounded-md bg-gray-200 px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("placa")}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.placa?.message}</p>
				</div>
				<div>
					<label htmlFor="tipoVeiculo" className="block text-sm/6 font-medium">
						Tipo do veículo
					</label>
					<select
						id="tipoVeiculo"
						autoComplete="tipoVeiculo"
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("tipoVeiculo", {
							required: "Selecione o tipo do veículo",
						})}
					>
						<option value="Caminhão">Caminhão</option>
						<option value="Carro">Carro</option>
						<option value="Van">Van</option>
						<option value="Caminhonete">Caminhonete</option>
					</select>
					<p className="text-red-700 text-sm text-nowrap">{errors.tipoVeiculo?.message}</p>
				</div>
				<div className="flex w-full p-0 m-0 items-end flex-nowrap gap-1">
					<div className="w-full">
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
						<p className="text-red-700 text-sm text-nowrap">{errors.capacidade?.message}</p>
					</div>
					<div className="w-fit">
						<select
							id="tipoCapacidade"
							autoComplete="tipoCapacidade"
							className="block w-fit h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							{...register("tipoCapacidade", { required: "Selecione o tipo da capacidade" })}
						>
							<option value="Kilogramas">Kg</option>
							<option value="Litros">L</option>
						</select>
						<p className="text-red-700 text-sm text-nowrap">{errors.tipoCapacidade?.message}</p>
					</div>
				</div>
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2">
					Editar
				</button>
			</form>
		</div>
	);
}
