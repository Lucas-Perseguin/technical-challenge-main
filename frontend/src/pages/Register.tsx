import { Link } from "react-router-dom";

export default function Register() {
	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Crie sua conta</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form action="#" method="POST" className="space-y-2">
						<div>
							<label htmlFor="nome" className="block text-sm/6 font-medium text-gray-900">
								Nome
							</label>
							<div className="mt-2">
								<input
									id="nome"
									name="nome"
									type="text"
									required
									autoComplete="nome"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="cpf" className="block text-sm/6 font-medium text-gray-900">
								CPF
							</label>
							<div className="mt-2">
								<input
									id="cpf"
									name="cpf"
									type="text"
									required
									autoComplete="cpf"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
								Email
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
								Senha
							</label>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
								/>
							</div>
							<div className="flex items-center justify-between mt-4">
								<div className="text-sm flex items-center gap-2">
									<input type="checkbox" className="h-3.5 w-3.5 mt-0.5" />
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
		</>
	);
}
