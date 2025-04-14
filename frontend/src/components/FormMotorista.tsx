import { useState } from 'react';
import axios from 'axios';

export default function FormMotorista() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    cnhNumero: '',
    cnhValidade: '',
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await axios.post('http://localhost:3001/api/motoristas', {
        nome: form.nome,
        cpf: form.cpf,
        cnh: {
          numero: form.cnhNumero,
          validade: form.cnhValidade,
        },
      });
      setStatus('✅ Motorista cadastrado com sucesso!');
      setForm({ nome: '', cpf: '', cnhNumero: '', cnhValidade: '' });
    } catch (err: any) {
      setStatus(`❌ Erro: ${err.response?.data?.erro || 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Motorista</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="cpf"
          placeholder="CPF (somente números)"
          value={form.cpf}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="cnhNumero"
          placeholder="Número da CNH"
          value={form.cnhNumero}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="date"
          name="cnhValidade"
          placeholder="Validade da CNH"
          value={form.cnhValidade}
          onChange={handleChange}
          required
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          type="submit"
        >
          Salvar
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
