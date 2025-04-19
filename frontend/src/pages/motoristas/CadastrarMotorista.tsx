import type { MotoristasType } from "@customTypes/motoristaTypes";
import { InputMask } from "@react-input/mask";
import { motoristaService } from "@services/motoristaService";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CadastrarMotorista() {
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

	async function cadastrarMotorista(data: Omit<MotoristasType, "_id" | "createdAt" | "updatedAt">) {
		try {
			const dataValidade = new Date(data.cnh.validade);
			dataValidade.setUTCHours(12);
			await motoristaService.cadastrarMotorista({
				...data,
				cnh: { validade: dataValidade.toISOString(), numero: data.cnh.numero },
			});
			toast.success("Motorista cadastrado com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<p className="text-xl md:text-2xl font-semibold mb-5">Cadastrar motorista</p>
			<form
				onSubmit={handleSubmit(cadastrarMotorista)}
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
							required: "Insira o nome",
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
							required: "Insira o CPF",
							minLength: { value: 14, message: "Insira o CPF completo" },
						}}
						render={({ field }) => (
							<InputMask
								id="cpf"
								type="text"
								autoComplete="cpf"
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								mask={maskOptions.mask}
								replacement={maskOptions.replacement}
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
						className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("cnh.numero", {
							required: "Insira o numéro da CNH",
							minLength: { value: 9, message: "Insira a CNH inteira" },
						})}
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
						autoComplete="cnh.validade"
						className="block w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("cnh.validade", { required: "Insira a validade da CNH" })}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.cnh?.numero?.message}</p>
				</div>
				<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2">
					Enviar
				</button>
			</form>
		</div>
	);
}
