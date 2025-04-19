import type { MotoristasType } from "@customTypes/motoristaTypes";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { InputMask, format } from "@react-input/mask";
import { motoristaService } from "@services/motoristaService";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function BuscarMotorista() {
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<Omit<MotoristasType, "_id" | "createdAt" | "updatedAt">>();
	const maskOptions = {
		mask: "___.___.___-__",
		replacement: { _: /\d/ },
	};

	const [valor, setValor] = useState<string>(id || "");

	async function buscarMotorista(id: string) {
		try {
			const { data: resposta } = await motoristaService.buscarMotorista(id);
			reset({
				...resposta,
				cpf: format(resposta.cpf, maskOptions),
				cnh: { validade: resposta.cnh.validade.split("T")[0], numero: resposta.cnh.numero },
			});
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	async function editarMotorista(data: Omit<MotoristasType, "_id" | "createdAt" | "updatedAt">) {
		try {
			const dataValidade = new Date(data.cnh.validade);
			dataValidade.setUTCHours(12);
			await motoristaService.editarMotorista({ nome: data.nome, cnh: { validade: dataValidade.toISOString() } }, valor);
			toast.success("Dados do motorista atualizados com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	useEffect(() => {
		if (id) {
			buscarMotorista(id);
		}
	}, [id]);

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<p className="text-xl md:text-2xl font-semibold mb-5">Visualizar e editar motorista</p>
			<div className="max-w-[calc(100%-2rem)] w-60 relative">
				<label htmlFor="nome" className="block text-sm/6 font-medium">
					ID do motorista
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
					onClick={() => buscarMotorista(valor)}
					className={`${valor.length === 24 ? "text-blue-600 cursor-pointer" : "text-gray-700"} size-8 absolute top-6 right-0`}
				/>
			</div>
			<form
				onSubmit={handleSubmit(editarMotorista)}
				className="flex flex-col md:grid md:grid-cols-2 max-w-[calc(100%-2rem)] text-gray-700 gap-4 md:gap-10 mt-14"
			>
				<div>
					<label htmlFor="nome" className="block text-sm/6 font-medium">
						Nome
					</label>
					<input
						id="nome"
						type="text"
						autoComplete="nome"
						className="block w-80 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("nome", {
							minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
							maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.nome?.message}</p>
				</div>
				<div>
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
								className="block w-full rounded-md bg-gray-200 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								mask={maskOptions.mask}
								replacement={maskOptions.replacement}
								disabled
								{...field}
							/>
						)}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.cpf?.message}</p>
				</div>
				<div>
					<label htmlFor="cnh.numero" className="block text-sm/6 font-medium">
						Número da CNH
					</label>
					<input
						id="cnh.numero"
						type="text"
						autoComplete="cnh.numero"
						disabled
						className="block w-full rounded-md bg-gray-200 px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("cnh.numero", { minLength: { value: 9, message: "Insira a CNH inteira" } })}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.cnh?.numero?.message}</p>
				</div>
				<div>
					<label htmlFor="cnh.validade" className="block text-sm/6 font-medium">
						Validade da CNH
					</label>
					<input
						id="cnh.validade"
						type="date"
						lang="pt-BR"
						autoComplete="cnh.validade"
						className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("cnh.validade")}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.cnh?.numero?.message}</p>
				</div>
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2">
					Editar
				</button>
			</form>
		</div>
	);
}
