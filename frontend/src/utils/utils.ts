export function mostrarCpf(cpf: string) {
	return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, function (regex, argumento1, argumento2, argumento3, argumento4) {
		return `${argumento1}.${argumento2}.${argumento3}-${argumento4}`;
	});
}
