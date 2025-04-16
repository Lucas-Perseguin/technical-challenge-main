import { ArrowRightEndOnRectangleIcon, BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/24/solid";
import useAuth from "@hooks/useAuth";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
	const location = useLocation();
	const { token } = useAuth();

	const [isUserModalOpen, setUserModalOpen] = useState(false);

	const isActive = (path: string) => (location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700");

	return (
		<nav className="bg-white shadow p-4 flex gap-6 justify-center relative">
			<Link to="/" className={isActive("/")}>
				Home
			</Link>
			<Link to="/cadastro" className={isActive("/cadastro")}>
				Cadastrar Motorista
			</Link>
			<Link to="/lista" className={isActive("/lista")}>
				Listar Motoristas
			</Link>
			<div className="absolute h-8 w-8 right-4 top-3" onClick={() => setUserModalOpen((prev) => !prev)}>
				{!token ? (
					<Link to="/login">
						<ArrowRightEndOnRectangleIcon className={`size-8 cursor-pointer ${isActive("/login")}`} />
					</Link>
				) : isUserModalOpen ? (
					<BarsArrowDownIcon className="size-8 cursor-pointer text-gray-700" />
				) : (
					<BarsArrowUpIcon className="size-8 cursor-pointer text-blue-600 font-semibold" />
				)}
			</div>
		</nav>
	);
}
