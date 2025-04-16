import axios from "axios";
import { useEffect, useState } from "react";

type Motorista = {
	_id: string;
	nome: string;
	cpf: string;
	cnh: {
		numero: string;
		validade: string;
	};
};

export default function ListaMotoristas() {
	const [motoristas, setMotoristas] = useState<Motorista[]>([]);
	const [filtroNome, setFiltroNome] = useState("");
	const [filtroCpf, setFiltroCpf] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMotoristas = async () => {
			try {
				const response = await axios.get("http://localhost:3001/api/motoristas");
				setMotoristas(response.data);
			} catch (error) {
				console.error("Erro ao buscar motoristas:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMotoristas();
	}, []);

	const motoristasFiltrados = motoristas.filter((m) => {
		const nomeMatch = m.nome.toLowerCase().includes(filtroNome.toLowerCase());
		const cpfMatch = m.cpf.includes(filtroCpf);
		return nomeMatch && cpfMatch;
	});

	return (
		<div className="mt-10 max-w-4xl mx-auto">
			<h2 className="text-xl font-semibold mb-4">Lista de Motoristas</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
				<input
					type="text"
					placeholder="Filtrar por nome..."
					value={filtroNome}
					onChange={(e) => setFiltroNome(e.target.value)}
					className="p-2 border rounded shadow-sm w-full"
				/>

				<input
					type="text"
					placeholder="Filtrar por CPF..."
					value={filtroCpf}
					onChange={(e) => setFiltroCpf(e.target.value)}
					className="p-2 border rounded shadow-sm w-full"
				/>
			</div>

			{loading ? (
				<p className="text-center">Carregando motoristas...</p>
			) : motoristasFiltrados.length === 0 ? (
				<p className="text-center">Nenhum motorista encontrado.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white shadow-md rounded border">
						<thead>
							<tr className="bg-gray-100 text-left">
								<th className="py-2 px-4 border-b">Nome</th>
								<th className="py-2 px-4 border-b">CPF</th>
								<th className="py-2 px-4 border-b">CNH</th>
								<th className="py-2 px-4 border-b">Validade</th>
							</tr>
						</thead>
						<tbody>
							{motoristasFiltrados.map((m) => (
								<tr key={m._id} className="hover:bg-gray-50">
									<td className="py-2 px-4 border-b">{m.nome}</td>
									<td className="py-2 px-4 border-b">{m.cpf}</td>
									<td className="py-2 px-4 border-b">{m.cnh.numero}</td>
									<td className="py-2 px-4 border-b">{new Date(m.cnh.validade).toLocaleDateString("pt-BR")}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
