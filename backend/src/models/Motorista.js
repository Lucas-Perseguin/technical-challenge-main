import mongoose from 'mongoose';

const MotoristaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{11}$/,
  },
  cnh: {
    numero: {
      type: String,
      required: true,
      unique: true,
    },
    validade: {
      type: Date,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Motorista = mongoose.model('Motorista', MotoristaSchema);
export default Motorista;
