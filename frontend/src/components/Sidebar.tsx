import { Link, Outlet, useLocation } from "react-router-dom";

const options: { [key: string]: { name: string; url: string; path: string | undefined }[] } = {
	motoristas: [
		{ name: "Listar", url: "", path: undefined },
		{ name: "Buscar", url: "/buscar", path: "buscar" },
		{ name: "Viagens", url: "/viagens", path: "viagens" },
		{ name: "Cadastrar", url: "/cadastrar", path: "cadastrar" },
	],
	veiculos: [
		{ name: "Listar", url: "", path: undefined },
		{ name: "Buscar", url: "/buscar", path: "buscar" },
		{ name: "Viagens", url: "/viagens", path: "viagens" },
		{ name: "Cadastrar", url: "/cadastrar", path: "cadastrar" },
	],
	viagens: [
		{ name: "Listar", url: "", path: undefined },
		{ name: "Buscar", url: "/buscar", path: "buscar" },
		{ name: "Cadastrar", url: "/cadastrar", path: "cadastrar" },
	],
};

export default function Sidebar() {
	const location = useLocation();
	const isActive = (path: string | undefined) =>
		location.pathname.split("/")[2] === path ? "text-blue-600 font-semibold" : "text-gray-700";

	return (
		<div>
			<div className="flex gap-6 py-2 items-center justify-center shadow w-full h-fit">
				{options[location.pathname.split("/")[1]]?.map((option) => (
					<Link
						to={`/${location.pathname.split("/")[1]}${option.url}`}
						className={`cursor-pointer ${isActive(option.path)}`}
						key={option.name}
					>
						{option.name}
					</Link>
				))}
			</div>
			<Outlet />
		</div>
	);
}
