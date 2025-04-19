import type { ListarMotoristasFiltrosType } from "@customTypes/motoristaTypes";
import { InputMask } from "@react-input/mask";
import { Controller, useForm } from "react-hook-form";

interface ListarMorotoristasFiltrosProps {
	setFiltros: React.Dispatch<React.SetStateAction<string>>;
}

export default function ListarMotoristasFiltros({ setFiltros }: ListarMorotoristasFiltrosProps) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<Omit<ListarMotoristasFiltrosType, "page" | "limit">>();

	function criarQueryString(data: Omit<ListarMotoristasFiltrosType, "page" | "limit">) {
		let query = "";
		for (const [key, value] of Object.entries(data)) {
			if (typeof value !== "object") {
				if (!value) continue;
				query += `&${key}=${key === "cpf" ? value.replace(/[^0-9]/g, "") : value}`;
			} else {
				if (!value.numero) continue;
				query += `&cnh.numero=${value.numero}`;
			}
		}
		return query;
	}

	return (
		<form
			onSubmit={handleSubmit((data) => setFiltros(criarQueryString(data)))}
			className="flex flex-col md:flex-row mb-5 text-gray-700 items-center md:items-end justify-center gap-3 md:gap-12"
		>
			<div className="relative">
				<label htmlFor="nome" className="block text-sm/6 font-medium">
					Nome
				</label>
				<input
					id="nome"
					type="text"
					autoComplete="nome"
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("nome", {
						minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
						maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
					})}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.nome?.message}</p>
			</div>
			<div className="relative">
				<label htmlFor="cpf" className="block text-sm/6 font-medium">
					CPF
				</label>
				<Controller
					name="cpf"
					control={control}
					rules={{
						minLength: { value: 14, message: "Insira o CPF completo" },
					}}
					render={({ field }) => (
						<InputMask
							id="cpf"
							type="text"
							autoComplete="cpf"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							mask="___.___.___-__"
							replacement={{ _: /\d/ }}
							{...field}
						/>
					)}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.cpf?.message}</p>
			</div>
			<div className="relative">
				<label htmlFor="cnh" className="block text-sm/6 font-medium">
					CNH
				</label>
				<input
					id="cnh"
					type="text"
					autoComplete="cnh"
					className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					{...register("cnh.numero", { minLength: { value: 9, message: "Insira a CNH inteira" } })}
				/>
				<p className="text-red-700 text-sm absolute -bottom-5 left-0 text-nowrap">{errors.cnh?.numero?.message}</p>
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
