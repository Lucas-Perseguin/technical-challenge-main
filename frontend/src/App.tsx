import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import { AuthContextProvider } from "@contexts/AuthContext";
import Home from "@pages/Home";
import BuscarMotorista from "@pages/motoristas/BuscarMotorista";
import CadastrarMotorista from "@pages/motoristas/CadastrarMotorista";
import ListarMotoristas from "@pages/motoristas/ListarMotoristas";
import Login from "@pages/usuarios/Login";
import Register from "@pages/usuarios/Register";
import Usuario from "@pages/usuarios/Usuario";
import BuscarVeiculo from "@pages/veiculos/BuscarVeiculo";
import CadastrarVeiculo from "@pages/veiculos/CadastrarVeiculo";
import ListarVeiculos from "@pages/veiculos/ListarVeiculos";
import BuscarViagem from "@pages/viagens/BuscarViagem";
import CadastrarViagem from "@pages/viagens/CadastrarViagem";
import ListarViagens from "@pages/viagens/ListarViagens";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<Router>
			<AuthContextProvider>
				<Navbar />
				<Routes>
					<Route index element={<Home />} />
					<Route path="*" element={<Navigate to="/" />} />
					<Route path="acessar" element={<Login />} />
					<Route path="registrar" element={<Register />} />
					<Route path="usuario" element={<Usuario />} />
					<Route element={<Sidebar />}>
						<Route path="motoristas">
							<Route index element={<ListarMotoristas />} />
							<Route path="buscar/:id?" element={<BuscarMotorista />} />
							<Route path="cadastrar" element={<CadastrarMotorista />} />
						</Route>
						<Route path="veiculos">
							<Route index element={<ListarVeiculos />} />
							<Route path="buscar/:id?" element={<BuscarVeiculo />} />
							<Route path="cadastrar" element={<CadastrarVeiculo />} />
						</Route>
						<Route path="viagens">
							<Route index element={<ListarViagens />} />
							<Route path="buscar/:id?" element={<BuscarViagem />} />
							<Route path="cadastrar" element={<CadastrarViagem />} />
						</Route>
					</Route>
				</Routes>
				<ToastContainer position="top-left" closeOnClick />
			</AuthContextProvider>
		</Router>
	);
}

export default App;
