import ModalDeletar from "@components/ModalDeletar";
import Paginacao from "@components/Paginacao";
import ListarMotoristasFiltros from "@components/filtros/ListarMotoristasFiltros";
import type { PaginacaoType } from "@customTypes/globalTypes";
import type { MotoristasType } from "@customTypes/motoristaTypes";
import { ArchiveBoxXMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { motoristaService } from "@services/motoristaService";
import { mostrarCpf } from "@utils/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ListarMotoristas() {
	const navigate = useNavigate();

	const [motoristas, setMotoristas] = useState<MotoristasType[]>([]);
	const [modal, setModal] = useState(<></>);
	const [paginacao, setPaginacao] = useState<PaginacaoType>({ itensTotal: 0, paginasTotal: 1, page: 1, limit: 10 });
	const [filtros, setFiltros] = useState("");
	const [auxDelecao, setAuxDelecao] = useState(0);

	function abrirModal(id: string) {
		setModal(<ModalDeletar funcao={motoristaService.deletarMotorista} id={id} setModal={setModal} setState={setAuxDelecao} />);
	}

	useEffect(() => {
		async function listarMotoristas() {
			try {
				const query = `page=${paginacao.page}&limit=${paginacao.limit}${filtros}`;
				const { data: resposta } = await motoristaService.listarMotoristas(query);
				setMotoristas(resposta.dados);
				setPaginacao((prev) => {
					return { ...prev, itensTotal: resposta.paginacao.itensTotal, paginasTotal: resposta.paginacao.paginasTotal };
				});
			} catch (erro: any) {
				toast.error(erro.response.data.erro || erro.response.data);
			}
		}

		listarMotoristas();
	}, [paginacao.page, paginacao.limit, filtros, auxDelecao]);

	return (
		<div className="w-full flex flex-col items-center pt-6 h-[calc(100vh-96px)] bg-gray-100">
			<p className="text-xl md:text-2xl font-semibold mb-5">Motoristas cadastrados</p>
			<ListarMotoristasFiltros setFiltros={setFiltros} />
			{motoristas.length ? (
				<>
					<div className="max-h-90 h-fit overflow-auto max-w-[calc(100vw-1rem)] w-fit">
						<table className="relative text-gray-700">
							<thead className="text-white">
								<tr className="sticky top-0 bg-blue-600">
									<th colSpan={2} className="bg-gray-100" />
									<th colSpan={2}>CNH</th>
									<th className="bg-gray-100" />
								</tr>
								<tr className="sticky top-6 bg-blue-600">
									<th className="border-1 border-gray-300">Nome</th>
									<th className="border-1 border-gray-300">CPF</th>
									<th className="border-1 border-gray-300">Número</th>
									<th className="border-1 border-gray-300">Validade</th>
									<th className="border-1 border-gray-300">Ações</th>
								</tr>
							</thead>
							<tbody className="text-center">
								{motoristas?.map((motorista, indice) => (
									<tr key={motorista._id}>
										<td className="w-60 px-4 py-2 border-gray-300 border-1">{motorista.nome}</td>
										<td className="px-4 py-2 whitespace-nowrap border-gray-300 border-1">{mostrarCpf(motorista.cpf)}</td>
										<td className="px-4 py-2 border-gray-300 border-1">{motorista.cnh.numero}</td>
										<td className="px-4 py-2 border-gray-300 border-1">
											{new Date(motorista.cnh.validade).toLocaleDateString()}
										</td>
										<td className="px-4 py-2 flex gap-4 border-gray-300 border-1">
											<PencilSquareIcon
												className="size-6 cursor-pointer hover:text-blue-600"
												onClick={() => navigate(`/motoristas/buscar/${motorista._id}`)}
											/>
											<ArchiveBoxXMarkIcon
												className="size-6 cursor-pointer hover:text-red-600"
												onClick={() => abrirModal(motorista._id)}
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
