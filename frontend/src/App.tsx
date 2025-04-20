import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import { AuthContextProvider } from "@contexts/AuthContext";
import Home from "@pages/Home";
import BuscarMotorista from "@pages/motoristas/BuscarMotorista";
import CadastrarMotorista from "@pages/motoristas/CadastrarMotorista";
import ListarMotoristas from "@pages/motoristas/ListarMotoristas";
import ViagensDoMotorista from "@pages/motoristas/ViagensDoMotorista";
import Login from "@pages/usuarios/Login";
import Register from "@pages/usuarios/Register";
import Usuario from "@pages/usuarios/Usuario";
import BuscarVeiculo from "@pages/veiculos/BuscarVeiculo";
import CadastrarVeiculo from "@pages/veiculos/CadastrarVeiculo";
import ListarVeiculos from "@pages/veiculos/ListarVeiculos";
import ViagensDoVeiculo from "@pages/veiculos/ViagensDoVeiculo";
import BuscarViagem from "@pages/viagens/BuscarViagem";
import CadastrarViagem from "@pages/viagens/CadastrarViagem";
import ListarViagens from "@pages/viagens/ListarViagens";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<Router>
			<AuthContextProvider>
				<Routes>
					<Route path="acessar" element={<Login />} />
					<Route path="registrar" element={<Register />} />
					<Route element={<Navbar />}>
						<Route path="*" element={<Navigate to="/" />} />
						<Route index element={<Home />} />
						<Route path="usuario" element={<Usuario />} />
						<Route element={<Sidebar />}>
							<Route path="motoristas">
								<Route index element={<ListarMotoristas />} />
								<Route path="buscar/:id?" element={<BuscarMotorista />} />
								<Route path="viagens/:id?" element={<ViagensDoMotorista />} />
								<Route path="cadastrar" element={<CadastrarMotorista />} />
							</Route>
							<Route path="veiculos">
								<Route index element={<ListarVeiculos />} />
								<Route path="buscar/:id?" element={<BuscarVeiculo />} />
								<Route path="viagens/:id?" element={<ViagensDoVeiculo />} />
								<Route path="cadastrar" element={<CadastrarVeiculo />} />
							</Route>
							<Route path="viagens">
								<Route index element={<ListarViagens />} />
								<Route path="buscar/:id?" element={<BuscarViagem />} />
								<Route path="cadastrar" element={<CadastrarViagem />} />
							</Route>
						</Route>
					</Route>
				</Routes>
				<ToastContainer position="top-left" closeOnClick />
			</AuthContextProvider>
		</Router>
	);
}

export default App;
