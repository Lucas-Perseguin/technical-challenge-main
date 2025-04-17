import { Link, useLocation } from "react-router-dom";

const options: { [key: string]: { name: string; url: string; path: string | undefined }[] } = {
	motoristas: [
		{ name: "Listar motoristas", url: "/", path: undefined },
		{ name: "Buscar motorista", url: "/buscar", path: "buscar" },
		{ name: "Cadastrar motorista", url: "/cadastrar", path: "cadastrar" },
	],
	veiculos: [
		{ name: "Listar veiculos", url: "/", path: undefined },
		{ name: "Buscar veiculo", url: "/buscar", path: "buscar" },
		{ name: "Cadastrar veiculo", url: "/cadastrar", path: "cadastrar" },
	],
	viagens: [
		{ name: "Listar viagens", url: "/", path: undefined },
		{ name: "Buscar viagem", url: "/buscar", path: "buscar" },
		{ name: "Cadastrar viagem", url: "/cadastrar", path: "cadastrar" },
	],
};

export default function Sidebar() {
	const location = useLocation();
	const isActive = (path: string | undefined) =>
		location.pathname.split("/")[2] === path ? "text-blue-600 font-semibold" : "text-gray-700";

	return (
		<div className="flex flex-col gap-2 pt-4 px-4 shadow w-fit h-svh">
			{options[location.pathname.split("/")[1]]?.map((option) => (
				<Link to={option.url} className={`cursor-pointer ${isActive(option.path)}`} key={option.name}>
					{option.name}
				</Link>
			))}
		</div>
	);
}
