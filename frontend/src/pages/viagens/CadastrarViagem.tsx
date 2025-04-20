import type { VisualizarViagemType } from "@customTypes/viagemTypes";
import { viagemService } from "@services/viagemService";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CadastrarViagem() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<VisualizarViagemType>();

	async function cadastrarViagem(data: VisualizarViagemType) {
		try {
			const dataPartida = new Date(data.dataPartida);
			dataPartida.setUTCHours(12);
			const previsaoChegada = new Date(data.previsaoChegada);
			previsaoChegada.setUTCHours(12);
			await viagemService.cadastrarViagem({ ...data, dataPartida, previsaoChegada });
			toast.success("Viagem cadastrada com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<p className="text-xl md:text-2xl font-semibold mb-5">Cadastrar viagem</p>
			<form
				onSubmit={handleSubmit(cadastrarViagem)}
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
					<label htmlFor="destino" className="block text-sm/6 font-medium">
						Destino
					</label>
					<input
						id="destino"
						autoComplete="destino"
						className="block w-full h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("destino", {
							required: "Insira a destino",
							minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
							maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.destino?.message}</p>
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
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2 h-10">
					Enviar
				</button>
			</form>
		</div>
	);
}
