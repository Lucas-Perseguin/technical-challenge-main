import ModalDeletar from "@components/ModalDeletar";
import useAuth from "@hooks/useAuth";
import { InputMask, format } from "@react-input/mask";
import { userService } from "@services/userService";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Usuario() {
	const { setToken } = useAuth();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		formState: { errors },
	} = useForm();
	const maskOptions = {
		mask: "___.___.___-__",
		replacement: { _: /\d/ },
	};

	const [modal, setModal] = useState(<></>);
	const [auxDelecao, setAuxDelecao] = useState(0);

	function abrirModal(id: string) {
		setModal(<ModalDeletar funcao={userService.deletarUsuario} id={id} setModal={setModal} setState={setAuxDelecao} />);
	}

	async function editarUsuario(data: any) {
		try {
			await userService.editarUsusario({ nome: data.nome, email: data.email }, data._id);
			toast.success("Seus dados foram atualizados com sucesso!");
		} catch (erro: any) {
			toast.error(erro.response.data.erro || erro.response.data);
		}
	}

	useEffect(() => {
		if (auxDelecao) {
			localStorage.clear();
			sessionStorage.clear();
			setToken(null);
			navigate("/acessar");
		}
	}, [auxDelecao]);

	useEffect(() => {
		async function buscarDadosDoUsuario() {
			const { data: usuario } = await userService.buscarPorToken();
			reset({ ...usuario, cpf: format(usuario.cpf, maskOptions) });
		}

		buscarDadosDoUsuario();
	}, []);

	return (
		<div className="w-full flex flex-col items-center min-h-[calc(100vh-96px)] bg-gray-100 justify-center">
			<form
				onSubmit={handleSubmit(editarUsuario)}
				className="flex flex-col md:grid md:grid-cols-2 max-w-[calc(100%-2rem)] text-gray-700 gap-4 md:gap-10"
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
					<label htmlFor="email" className="block text-sm/6 font-medium">
						Email
					</label>
					<input
						id="email"
						type="text"
						autoComplete="email"
						className="block w-80 max-w-full rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...register("email", {
							minLength: { value: 3, message: "Insira pelo menos 3 caracteres" },
							maxLength: { value: 60, message: "Insira no máximo 60 caracteres" },
						})}
					/>
					<p className="text-red-700 text-sm text-nowrap">{errors.email?.message}</p>
				</div>
				<div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 md:gap-10 md:col-span-2 md:items-end">
					<div>
						<label htmlFor="cpf" className="block text-sm/6 font-medium">
							cpf
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
					<button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer md:col-start-2 h-10">
						Editar
					</button>
				</div>
			</form>
			<button
				onClick={() => abrirModal(getValues("_id"))}
				type="button"
				className="px-4 py-2 rounded bg-red-600 text-white cursor-pointer mt-6 w-80 max-w-[calc(100%-2rem)] "
			>
				Deletar minha conta
			</button>
			{modal}
		</div>
	);
}
