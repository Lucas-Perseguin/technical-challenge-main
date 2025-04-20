import ModalDeletar from "@components/ModalDeletar";
import Paginacao from "@components/Paginacao";
import ListarViagensFiltros from "@components/filtros/ListarViagensFiltros";
import type { PaginacaoType } from "@customTypes/globalTypes";
import type { ViagemType } from "@customTypes/viagemTypes";
import { ArchiveBoxXMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { viagemService } from "@services/viagemService";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ListarViagens() {
	const navigate = useNavigate();

	const [viagens, setviagens] = useState<ViagemType[]>([]);
	const [modal, setModal] = useState(<></>);
	const [paginacao, setPaginacao] = useState<PaginacaoType>({ itensTotal: 0, paginasTotal: 1, page: 1, limit: 10 });
	const [filtros, setFiltros] = useState("");
	const [auxDelecao, setAuxDelecao] = useState(0);

	function abrirModal(id: string) {
		setModal(<ModalDeletar funcao={viagemService.deletarViagem} id={id} setModal={setModal} setState={setAuxDelecao} />);
	}

	useEffect(() => {
		async function listarViagens() {
			try {
				const query = `page=${paginacao.page}&limit=${paginacao.limit}${filtros}`;
				const { data: resposta } = await viagemService.listarViagens(query);
				setviagens(resposta.dados);
				setPaginacao((prev) => {
					return { ...prev, itensTotal: resposta.paginacao.itensTotal, paginasTotal: resposta.paginacao.paginasTotal };
				});
			} catch (erro: any) {
				toast.error(erro.response.data.erro || erro.response.data);
			}
		}

		listarViagens();
	}, [paginacao.page, paginacao.limit, filtros, auxDelecao]);

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<ListarViagensFiltros setFiltros={setFiltros} />
			{viagens.length ? (
				<>
					<div className="max-h-160 h-fit overflow-auto max-w-[calc(100vw-1rem)] w-fit">
						<table className="relative text-gray-700">
							<thead className="text-white">
								<tr className="sticky top-0 bg-blue-600">
									<th className="border-1 border-gray-300">Motorista</th>
									<th className="border-1 border-gray-300">Placa</th>
									<th className="border-1 border-gray-300">Origem</th>
									<th className="border-1 border-gray-300">Destino</th>
									<th className="border-1 border-gray-300">Partida</th>
									<th className="border-1 border-gray-300 text-wrap px-4"> Previsão de chegada</th>
									<th className="border-1 border-gray-300">Status</th>
									<th className="border-1 border-gray-300">Ações</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{viagens?.map((viagem) => (
									<tr key={viagem._id}>
										<td
											className={`px-4 py-2 border-gray-300 border-1 ${viagem.motorista ? "cursor-pointer underline hover:text-blue-800" : "cursor-default"}`}
										>
											{viagem.motorista ? (
												<Link to={`/motoristas/buscar/${viagem.motorista}`}>{viagem.motoristaInfo?.nome}</Link>
											) : (
												<>Não encontrado</>
											)}
										</td>
										<td
											className={`px-4 py-2 border-gray-300 border-1 ${viagem.veiculo ? "cursor-pointer underline hover:text-blue-800" : "cursor-default"}`}
										>
											{viagem.veiculo ? (
												<Link to={`/veiculos/buscar/${viagem.veiculo}`}>{viagem.veiculoInfo?.placa}</Link>
											) : (
												<>Não encontrado</>
											)}
										</td>
										<td className="px-4 py-2 border-gray-300 border-1">{viagem.origem}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{viagem.destino}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{new Date(viagem.dataPartida).toLocaleDateString()}</td>
										<td className="px-4 py-2 border-gray-300 border-1">
											{new Date(viagem.previsaoChegada).toLocaleDateString()}
										</td>
										<td className="px-4 py-2 border-gray-300 border-1">{viagem.status}</td>
										<td className="px-4 py-2 flex gap-4 border-gray-300 border-1">
											<PencilSquareIcon
												className="size-6 cursor-pointer hover:text-blue-600"
												onClick={() => navigate(`/viagens/buscar/${viagem._id}`)}
											/>
											<ArchiveBoxXMarkIcon
												className="size-6 cursor-pointer hover:text-red-600"
												onClick={() => abrirModal(viagem._id)}
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
