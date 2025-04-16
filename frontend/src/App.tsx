import Navbar from "@components/Navbar";
import { AuthContextProvider } from "@contexts/AuthContext";
import Cadastro from "@pages/Cadastro";
import Home from "@pages/Home";
import Lista from "@pages/Lista";
import Login from "@pages/Login";
import Register from "@pages/Register";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<Router>
			<AuthContextProvider>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/cadastro" element={<Cadastro />} />
					<Route path="/lista" element={<Lista />} />
					<Route path="*" element={<Navigate to="/" />} />
					<Route path="/acessar" element={<Login />} />
					<Route path="/registrar" element={<Register />} />
				</Routes>
				<ToastContainer position="top-left" closeOnClick />
			</AuthContextProvider>
		</Router>
	);
}

export default App;
