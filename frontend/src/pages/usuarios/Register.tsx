import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useAuth from "@hooks/useAuth";
import { InputMask } from "@react-input/mask";
import { userService } from "@services/userService";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export interface RegisterInputs {
	cpf: string;
	senha: string;
	email: string;
	nome: string;
	remember: boolean;
}

export default function Register() {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RegisterInputs>({
		defaultValues: {
			cpf: "",
			senha: "",
			email: "",
			nome: "",
			remember: false,
		},
	});
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState(false);

	const submit: SubmitHandler<RegisterInputs> = async (data) => {
		try {
			const { token } = (await userService.register({
				cpf: data.cpf,
				senha: data.senha,
				email: data.email,
				nome: data.nome,
			})) as { token: string };
			toast.success("Cadastro realizado com sucesso!");
			login(token, data.remember);
		} catch (error: any) {
			toast.error(error.response.data.erro || error.response.data);
		}
	};

	const emailRegex = /^(.+)@(.+){2,}\.(.+){2,}$/;

	return (
		<div className="flex flex-col w-full h-dvh items-center justify-center box-border px-6">
			<div className="flex min-h-full flex-1 flex-col justify-center w-full">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Crie sua conta</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm w-full">
					<form onSubmit={handleSubmit(submit)} className="space-y-2">
						<div>
							<label htmlFor="nome" className="block text-sm/6 font-medium text-gray-900">
								Nome
							</label>
							<div className="mt-2">
								<input
									id="nome"
									type="text"
									autoComplete="nome"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									{...register("nome", { required: "Insira um nome" })}
								/>
								<p className="text-red-700 text-sm">{errors.nome?.message}</p>
							</div>
						</div>

						<div>
							<label htmlFor="cpf" className="block text-sm/6 font-medium text-gray-900">
								CPF
							</label>
							<div className="mt-2">
								<Controller
									name="cpf"
									control={control}
									rules={{
										required: "Insira um CPF",
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
								<p className="text-red-700 text-sm">{errors.cpf?.message}</p>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								Email
							</label>
							<div className="mt-2">
								<input
									id="email"
									type="email"
									autoComplete="email"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									{...register("email", {
										required: "Insira um email",
										pattern: { value: emailRegex, message: "Insira um email válido" },
									})}
								/>
								<p className="text-red-700 text-sm">{errors.email?.message}</p>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
								Senha
							</label>
							<div className="mt-2 relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									{...register("senha", { required: "Insira uma senha" })}
								/>
								<p className="text-red-700 text-sm">{errors.senha?.message}</p>
								{showPassword ? (
									<EyeSlashIcon
										className="size-6 text-gray-700 absolute right-2 top-1.5"
										onClick={() => setShowPassword((prev) => !prev)}
									/>
								) : (
									<EyeIcon
										className="size-6 text-gray-700 absolute right-2 top-1.5"
										onClick={() => setShowPassword((prev) => !prev)}
									/>
								)}
							</div>
							<div className="flex items-center justify-between mt-4">
								<div className="text-sm flex items-center gap-2">
									<input type="checkbox" className="h-3.5 w-3.5 mt-0.5" {...register("remember")} />
									<p>Lembrar de mim</p>
								</div>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Criar
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Já tem uma conta?{" "}
						<Link to="/acessar" className="font-semibold text-indigo-600 hover:text-indigo-500">
							Acesse
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
