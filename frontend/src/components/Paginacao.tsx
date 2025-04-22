import type { PaginacaoType } from "@customTypes/globalTypes";

interface PaginacaoProps {
	totalItems: number;
	totalPages: number;
	itemsPerPage: number;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<PaginacaoType>>;
}

export default function Paginacao({ totalItems, itemsPerPage, currentPage, setCurrentPage, totalPages }: PaginacaoProps) {
	const pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(i);
	}

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => {
				return { ...prev, page: prev.page - 1 };
			});
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => {
				return { ...prev, page: prev.page + 1 };
			});
		}
	};

	return (
		<div className="flex justify-center items-center space-x-2 mt-4 mb-6">
			<button
				className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-default" : "bg-blue-600 text-white cursor-pointer"}`}
				onClick={handlePrevious}
				disabled={currentPage === 1}
			>
				Anterior
			</button>
			{pages.map((page) => (
				<button
					key={page}
					className={`px-4 py-2 rounded ${currentPage === page ? "bg-blue-600 text-white cursor-default" : "bg-gray-200 cursor-pointer"}`}
					onClick={() =>
						setCurrentPage((prev) => {
							return { ...prev, page };
						})
					}
				>
					{page}
				</button>
			))}
			<button
				className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-default" : "bg-blue-600 text-white cursor-pointer"}`}
				onClick={handleNext}
				disabled={currentPage === totalPages}
			>
				Próxima
			</button>
			<select
				onChange={(e) =>
					setCurrentPage((prev) => {
						return { ...prev, limit: Number(e.target.value) };
					})
				}
				value={itemsPerPage}
				className="block w-fit h-10 rounded-md bg-white px-2 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
			>
				<option value={10}>10</option>
				<option value={20}>20</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>
			<p>Total: {totalItems}</p>
		</div>
	);
}
