import {
	ArrowRightEndOnRectangleIcon,
	ArrowRightStartOnRectangleIcon,
	BarsArrowDownIcon,
	BarsArrowUpIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import useAuth from "@hooks/useAuth";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
	const location = useLocation();
	const { token, logout } = useAuth();
	const navigate = useNavigate();

	const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

	const isActive = (path: string) => (location.pathname.split("/")[1] === path ? "text-blue-600 font-semibold" : "text-gray-700");

	useEffect(() => {
		if (!token && location.pathname !== "/acessar" && location.pathname !== "/" && location.pathname !== "/registrar") {
			navigate("/acessar");
		}
	}, [location]);

	return (
		<>
			<nav className="bg-white shadow p-4 flex gap-6 items-center justify-center relative w-full min-h-14">
				<Link to="/" className="absolute left-4 top-auto">
					<img
						alt="Your Company"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
						className="mx-auto h-6 w-auto md:h-8"
					/>
				</Link>
				{token ? (
					<>
						<Link to="/motoristas" className={isActive("motoristas")}>
							Motorista
						</Link>
						<Link to="/veiculos" className={isActive("veiculos")}>
							Veículos
						</Link>
						<Link to="/viagens" className={isActive("viagens")}>
							Viagens
						</Link>
					</>
				) : (
					<></>
				)}
				<div className="absolute h-fit w-fit right-4 top-auto">
					{!token ? (
						<Link to="/acessar">
							<ArrowRightEndOnRectangleIcon className={`size-6 md:size-8 cursor-pointer ${isActive("entrar")}`} />
						</Link>
					) : isUserDropdownOpen ? (
						<BarsArrowUpIcon
							className="size-6 md:size-8 cursor-pointer text-blue-600 font-semibold"
							onClick={() => setUserDropdownOpen((prev) => !prev)}
						/>
					) : (
						<BarsArrowDownIcon
							className="size-6 md:size-8 cursor-pointer text-gray-700"
							onClick={() => setUserDropdownOpen((prev) => !prev)}
						/>
					)}
				</div>
				<div
					className={`absolute flex flex-col gap-4 text-gray-700 p-4 top-full right-0 transition-all shadow bg-white ${isUserDropdownOpen && token ? "" : "hidden"}`}
				>
					<Link to="/usuario" className="cursor-pointer">
						<div
							className="cursor-pointer flex items-center justify-end gap-2"
							onClick={() => {
								setUserDropdownOpen(false);
							}}
						>
							Minha conta
							<UserCircleIcon className="size-6" />
						</div>
					</Link>
					<div
						className="cursor-pointer flex items-center justify-end gap-2"
						onClick={() => {
							setUserDropdownOpen(false);
							logout();
						}}
					>
						Sair
						<ArrowRightStartOnRectangleIcon className="size-6" />
					</div>
				</div>
			</nav>
			{token || location.pathname === "/" ? <Outlet /> : <></>}
		</>
	);
}
