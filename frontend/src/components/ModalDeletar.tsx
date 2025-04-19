import type { JSX } from "react";
import { toast } from "react-toastify";

interface ModalDeletarType {
	indice: number;
	id: string;
	setState: React.Dispatch<React.SetStateAction<number>>;
	funcao: (id: string) => Promise<any>;
	setModal: React.Dispatch<React.SetStateAction<JSX.Element>>;
}

export default function ModalDeletar({ indice, id, setState, funcao, setModal }: ModalDeletarType) {
	async function deletar() {
		try {
			await funcao(id);
			toast.success("Item deletado com sucesso");
			setState((prev) => prev + 1);
			setModal(<></>);
		} catch (erro: any) {
			toast.error(erro.erro);
		}
	}

	return (
		<div className="z-10 flex flex-col justify-between fixed top-[calc(50%-6.25rem)] left-auto max-w-[calc(100%-2rem)] max-h-full w-120 h-50 bg-white rounded-4xl p-10 shadow text-center text-lg md:text-xl">
			<p>Você realmente deseja deletar esse item?</p>
			<div className="flex w-full justify-between px-4 text-white">
				<button type="button" className="cursor-pointer bg-red-600 rounded-xl px-4 py-2" onClick={() => setModal(<></>)}>
					Cancelar
				</button>
				<button type="button" className="cursor-pointer bg-blue-600 rounded-xl px-4 py-2" onClick={deletar}>
					Confirmar
				</button>
			</div>
		</div>
	);
}
