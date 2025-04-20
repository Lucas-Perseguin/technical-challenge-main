import ModalDeletar from "@components/ModalDeletar";
import Paginacao from "@components/Paginacao";
import ListarVeiculosFiltros from "@components/filtros/ListarVeiculosFiltros";
import type { PaginacaoType } from "@customTypes/globalTypes";
import type { VeiculoType } from "@customTypes/veiculoTypes";
import { ArchiveBoxXMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { veiculoService } from "@services/veiculoService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ListarVeiculos() {
	const navigate = useNavigate();

	const [veiculos, setVeiculos] = useState<VeiculoType[]>([]);
	const [modal, setModal] = useState(<></>);
	const [paginacao, setPaginacao] = useState<PaginacaoType>({ itensTotal: 0, paginasTotal: 1, page: 1, limit: 10 });
	const [filtros, setFiltros] = useState("");
	const [auxDelecao, setAuxDelecao] = useState(0);

	function abrirModal(id: string) {
		setModal(<ModalDeletar funcao={veiculoService.deletarVeiculo} id={id} setModal={setModal} setState={setAuxDelecao} />);
	}

	useEffect(() => {
		async function listarVeiculos() {
			try {
				const query = `page=${paginacao.page}&limit=${paginacao.limit}${filtros}`;
				const { data: resposta } = await veiculoService.listarVeiculos(query);
				setVeiculos(resposta.dados);
				setPaginacao((prev) => {
					return { ...prev, itensTotal: resposta.paginacao.itensTotal, paginasTotal: resposta.paginacao.paginasTotal };
				});
			} catch (erro: any) {
				toast.error(erro.response.data.erro || erro.response.data);
			}
		}

		listarVeiculos();
	}, [paginacao.page, paginacao.limit, filtros, auxDelecao]);

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<p className="text-xl md:text-2xl font-semibold mb-5">Veiculos cadastrados</p>
			<ListarVeiculosFiltros setFiltros={setFiltros} />
			{veiculos.length ? (
				<>
					<div className="max-h-90 h-fit overflow-auto max-w-[calc(100vw-1rem)] w-fit">
						<table className="relative text-gray-700">
							<thead className="text-white">
								<tr className="sticky top-0 bg-blue-600">
									<th colSpan={3} className="border-1 border-gray-300">
										Veículo
									</th>
									<th colSpan={2} className="border-1 border-gray-300">
										Capacidade
									</th>
									<th className="bg-gray-100" />
								</tr>
								<tr className="sticky top-6 bg-blue-600">
									<th className="border-1 border-gray-300">Modelo</th>
									<th className="border-1 border-gray-300">Placa</th>
									<th className="border-1 border-gray-300">Tipo</th>
									<th className="border-1 border-gray-300">Tipo</th>
									<th className="border-1 border-gray-300 px-2">Quantidade</th>
									<th>Ações</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{veiculos?.map((veiculo, indice) => (
									<tr key={veiculo._id}>
										<td className="px-4 py-2 border-gray-300 border-1">{veiculo.modelo}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{veiculo.placa}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{veiculo.tipoVeiculo}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{veiculo.tipoCapacidade}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{veiculo.capacidade}</td>
										<td className="px-4 py-2 flex gap-4 border-gray-300 border-1">
											<PencilSquareIcon
												className="size-6 cursor-pointer hover:text-blue-600"
												onClick={() => navigate(`/veiculos/buscar/${veiculo._id}`)}
											/>
											<ArchiveBoxXMarkIcon
												className="size-6 cursor-pointer hover:text-red-600"
												onClick={() => abrirModal(veiculo._id)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<Paginacao
						currentPage={paginacao.page}
						itemsPerPage={paginacao.limit}
						totalItems={paginacao.itensTotal}
						totalPages={paginacao.paginasTotal}
						setCurrentPage={setPaginacao}
					/>
					{modal}
				</>
			) : (
				<></>
			)}
		</div>
	);
}
