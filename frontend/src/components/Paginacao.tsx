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
		<div className="flex justify-center items-center space-x-2 mt-4">
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
		</div>
	);
}
