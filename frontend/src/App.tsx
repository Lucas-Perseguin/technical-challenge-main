import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import { AuthContextProvider } from "@contexts/AuthContext";
import Home from "@pages/Home";
import ListarMotoristas from "@pages/motoristas/ListarMotoristas";
import Login from "@pages/usuarios/Login";
import Register from "@pages/usuarios/Register";
import ListarVeiculos from "@pages/veiculos/ListarVeiculos";
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
					<Route path="/acessar" element={<Login />} />
					<Route path="/registrar" element={<Register />} />
					<Route element={<Sidebar />}>
						<Route path="/motoristas">
							<Route index element={<ListarMotoristas />} />
						</Route>
						<Route path="/veiculos">
							<Route index element={<ListarVeiculos />} />
						</Route>
						<Route path="/viagens">
							<Route index element={<ListarViagens />} />
						</Route>
					</Route>
				</Routes>
				<ToastContainer position="top-left" closeOnClick />
			</AuthContextProvider>
		</Router>
	);
}

export default App;
