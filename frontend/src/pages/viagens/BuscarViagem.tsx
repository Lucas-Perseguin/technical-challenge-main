import type { VisualizarViagemType } from "@customTypes/viagemTypes";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { viagemService } from "@services/viagemService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function BuscarViagem() {
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<VisualizarViagemType>();

	const [valor, setValor] = useState<string>(id || "");

	async function buscarViagem(id: string) {
		try {
			const { data: resposta } = await viagemService.buscarViagem(id);
			reset({
				...resposta,
				motorista: resposta.motorista?._id,
				veiculo: resposta.veiculo?._id,
				dataPartida: resposta.dataPartida.split("T")[0],
				previsaoChegada: resposta.previsaoChegada.split("T")[0],
			});
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	async function editarViagem(data: VisualizarViagemType) {
		try {
			const dataPartida = new Date(data.dataPartida);
			dataPartida.setUTCHours(12);
			const previsaoChegada = new Date(data.previsaoChegada);
			previsaoChegada.setUTCHours(12);
			await viagemService.editarViagem(
				{
					motorista: data.motorista,
					veiculo: data.veiculo,
					origem: data.origem,
					destino: data.destino,
					status: data.status,
					dataPartida,
					previsaoChegada,
				},
				valor,
			);
			toast.success("Dados da viagem atualizados com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	useEffect(() => {
		if (id) {
			buscarViagem(id);
		}
	}, [id]);

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<div className="max-w-[calc(100%-2rem)] w-60 relative">
				<label htmlFor="nome" className="block text-sm/6 font-medium">
					ID da viagem
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
					onClick={() => buscarViagem(valor)}
					className={`${valor.length === 24 ? "text-blue-600 cursor-pointer" : "text-gray-700"} size-8 absolute top-6 right-0`}
				/>
			</div>
			<form
				onSubmit={handleSubmit(editarViagem)}
				className="flex flex-col md:grid md:grid-cols-2 max-w-[calc(100%-2rem)] text-gray-700 gap-4 md:gap-10 mt-14"
			>
				<div>
					<label htmlFor="Motorista" className="block text-sm/6 font-medium">
						Motorista
					</label>
					<input
						id="motorista"
						type="text"
						autoComplete="motorista"
						className="block w-80 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("motorista", {
							required: "Insira a ID do motorista",
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.motorista?.message}</p>
				</div>
				<div>
					<label htmlFor="veiculo" className="block text-sm/6 font-medium">
						Veículo
					</label>
					<input
						id="veiculo"
						type="text"
						autoComplete="veiculo"
						className="block w-80 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("veiculo", {
							required: "Insira a ID do veículo",
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.veiculo?.message}</p>
				</div>
				<div>
					<label htmlFor="origem" className="block text-sm/6 font-medium">
						Origem
					</label>
					<input
						id="origem"
						autoComplete="origem"
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("origem", {
							required: "Insira a origem",
							minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
							maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.origem?.message}</p>
				</div>
				<div>
					<label htmlFor="dataPartida" className="block text-sm/6 font-medium">
						Partida
					</label>
					<input
						id="dataPartida"
						autoComplete="dataPartida"
						type="date"
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("dataPartida", {
							required: "Insira a dataPartida",
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.dataPartida?.message}</p>
				</div>
				<div>
					<label htmlFor="previsaoChegada" className="block text-sm/6 font-medium">
						Previsão de chegada
					</label>
					<input
						id="previsaoChegada"
						autoComplete="previsaoChegada"
						type="date"
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("previsaoChegada", {
							required: "Insira a previsaoChegada",
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.previsaoChegada?.message}</p>
				</div>
				<div>
					<label htmlFor="status" className="block text-sm/6 font-medium">
						Status
					</label>
					<select
						id="status"
						autoComplete="status"
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("status", {
							required: "Insira a status",
						})}
					>
						<option value="Planejada">Planejada</option>
						<option value="Em andamento">Em andamento</option>
						<option value="Concluída">Concluída</option>
						<option value="Cancelada">Cancelada</option>
					</select>
					<p className="text-red-700 text-sm text-nowrap">{errors.status?.message}</p>
				</div>
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2">
					Editar
				</button>
			</form>
		</div>
	);
}
