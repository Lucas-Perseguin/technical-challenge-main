import type { ListarViagensFiltrosType } from "@customTypes/viagemTypes";
import { useForm } from "react-hook-form";

interface ListarViagensFiltrosProps {
	setFiltros: React.Dispatch<React.SetStateAction<string>>;
}

export default function ListarViagensFiltros({ setFiltros }: ListarViagensFiltrosProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Omit<ListarViagensFiltrosType, "page" | "limit">>();

	function criarQueryString(data: Omit<ListarViagensFiltrosType, "page" | "limit">) {
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
				<label htmlFor="origem" className="block text-sm/6 font-medium">
					Origem
				</label>
				<input
					id="origem"
					type="text"
					autoComplete="origem"
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("origem", {
						minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
						maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
					})}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.origem?.message}</p>
			</div>
			<div className="relative">
				<label htmlFor="destino" className="block text-sm/6 font-medium">
					Destino
				</label>
				<input
					id="destino"
					type="text"
					autoComplete="destino"
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("destino")}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.destino?.message}</p>
			</div>
			<div className="relative">
				<label htmlFor="status" className="block text-sm/6 font-medium">
					Status
				</label>
				<select
					id="status"
					autoComplete="status"
					defaultValue=""
					className="block w-49 h-9 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("status")}
				>
					<option value="">Selecionar</option>
					<option value="Planejada">Planejada</option>
					<option value="Em andamento">Em andamento</option>
					<option value="Concluída">Concluída</option>
					<option value="Cancelada">Cancelada</option>
				</select>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.status?.message}</p>
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
