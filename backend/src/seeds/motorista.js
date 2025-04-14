import 'dotenv/config';
import mongoose from 'mongoose';
import Motorista from '../models/Motorista.js';

const motoristas = [
  {
    nome: 'João Silva',
    cpf: '11122233344',
    cnh: {
      numero: 'CNH001',
      validade: new Date('2026-12-01')
    }
  },
  {
    nome: 'Maria Oliveira',
    cpf: '55566677788',
    cnh: {
      numero: 'CNH002',
      validade: new Date('2025-10-15')
    }
  },
  {
    nome: 'Carlos Mendes',
    cpf: '99988877766',
    cnh: {
      numero: 'CNH003',
      validade: new Date('2027-04-30')
    }
  }
];

const seedMotoristas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB');

    await Motorista.deleteMany();
    console.log('Coleção Motoristas limpa');

    const result = await Motorista.insertMany(motoristas);
    console.log(`${result.length} motoristas inseridos`);

    process.exit(0);
  } catch (error) {
    console.error('Erro ao fazer seed:', error);
    process.exit(1);
  }
};

seedMotoristas();
