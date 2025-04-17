import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useAuth from "@hooks/useAuth";
import { InputMask } from "@react-input/mask";
import { userService } from "@services/userService";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export interface LoginInputs {
	cpf: string;
	senha: string;
	remember: boolean;
}

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<LoginInputs>({
		defaultValues: {
			cpf: "",
			senha: "",
			remember: false,
		},
	});

	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState(false);

	const submit: SubmitHandler<LoginInputs> = async (data) => {
		try {
			const { token } = (await userService.login({ cpf: data.cpf, senha: data.senha })) as { token: string };
			toast.success("Acesso realizado com sucesso!");
			login(token, data.remember);
		} catch (error: any) {
			toast.error(error.erro as string);
		}
	};

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Acesse sua conta</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleSubmit(submit)} className="space-y-2">
						<div>
							<label htmlFor="cpf" className="block text-sm/6 font-medium text-gray-900">
								CPF
							</label>
							<div className="mt-2">
								<Controller
									name="cpf"
									control={control}
									rules={{
										required: "Insira seu CPF",
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
							<label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
								Senha
							</label>
							<div className="mt-2 relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									{...register("senha", { required: "Insira sua senha" })}
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
								<div className="text-sm">
									<Link to="/resetar-senha" className="font-semibold text-indigo-600 hover:text-indigo-500">
										Esqueceu sua senha?
									</Link>
								</div>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Acessar
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-500">
						Não tem uma conta?{" "}
						<Link to="/registrar" className="font-semibold text-indigo-600 hover:text-indigo-500">
							Registre-se
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
