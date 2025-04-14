import Motorista from '../models/Motorista.js';

export const criar = async (req, res) => {
  try {
    const novoMotorista = await Motorista.create(req.body);
    res.status(201).json(novoMotorista);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const motoristas = await Motorista.find();
    res.json(motoristas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const motorista = await Motorista.findById(req.params.id);
    if (!motorista) return res.status(404).json({ erro: 'Motorista não encontrado' });
    res.json(motorista);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const motoristaAtualizado = await Motorista.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!motoristaAtualizado) return res.status(404).json({ erro: 'Motorista não encontrado' });
    res.json(motoristaAtualizado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const motoristaRemovido = await Motorista.findByIdAndDelete(req.params.id);
    if (!motoristaRemovido) return res.status(404).json({ erro: 'Motorista não encontrado' });
    res.json({ mensagem: 'Motorista removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
