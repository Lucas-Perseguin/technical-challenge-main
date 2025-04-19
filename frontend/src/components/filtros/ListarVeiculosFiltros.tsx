import type { ListarVeiculosFiltrosType } from "@customTypes/veiculoTypes";
import { useForm } from "react-hook-form";

interface ListarVeiculosFiltrosProps {
	setFiltros: React.Dispatch<React.SetStateAction<string>>;
}

export default function ListarVeiculosFiltros({ setFiltros }: ListarVeiculosFiltrosProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Omit<ListarVeiculosFiltrosType, "page" | "limit">>();

	function criarQueryString(data: Omit<ListarVeiculosFiltrosType, "page" | "limit">) {
		let query = "";
		for (const [key, value] of Object.entries(data)) {
			if (!value) continue;
			query += `&${key}=${value}`;
		}
		return query;
	}

	return (
		<form
			onSubmit={handleSubmit((data) => setFiltros(criarQueryString(data)))}
			className="flex flex-col md:flex-row mb-5 text-gray-700 items-center md:items-end justify-center gap-3 md:gap-12"
		>
			<div className="relative">
				<label htmlFor="modelo" className="block text-sm/6 font-medium">
					Modelo
				</label>
				<input
					id="modelo"
					type="text"
					autoComplete="modelo"
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("modelo", {
						minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
						maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
					})}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.modelo?.message}</p>
			</div>
			<div className="relative">
				<label htmlFor="placa" className="block text-sm/6 font-medium">
					Placa
				</label>
				<input
					id="placa"
					type="text"
					autoComplete="placa"
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("placa")}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.placa?.message}</p>
			</div>
			<div className="relative">
				<label htmlFor="tipoVeiculo" className="block text-sm/6 font-medium">
					Tipo
				</label>
				<select
					id="tipoVeiculo"
					autoComplete="tipoVeiculo"
					defaultValue=""
					className="block w-49 h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("tipoVeiculo")}
				>
					<option value="">Selecionar</option>
					<option value="Caminhão">Caminhão</option>
					<option value="Carro">Carro</option>
					<option value="Van">Van</option>
					<option value="Caminhonete">Caminhonete</option>
				</select>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.tipoVeiculo?.message}</p>
			</div>
			<div className="flex gap-2">
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer">
					Filtrar
				</button>
				<button type="button" onClick={() => reset()} className="px-4 py-2 rounded bg-red-600 text-white cursor-pointer">
					Limpar
				</button>
			</div>
		</form>
	);
}
