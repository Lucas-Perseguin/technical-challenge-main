# Desafio Técnico – Desenvolvedor Fullstack

## Objetivo
Criar uma aplicação para gerenciar frotas e viagens de uma empresa de logística. A aplicação deve permitir o cadastro de motoristas e veículos, o planejamento de viagens e o rastreamento das mesmas.

## Requisitos
- Backend (Node.js + Express)
- Cadastro de veículos (modelo, placa, tipo, capacidade)
- Cadastro de motoristas (nome, CPF, CNH, validade da CNH)
- Criação de viagens com:
  - Veículo associado
  - Motorista associado
  - Origem, destino
  - Data e hora de partida e previsão de chegada
- Endpoint para listar viagens por motorista
- Utilizar MongoDB para persistência
- Utilizar Redis para cache da listagem de veículos (Opcional)

- Frontend (Next.js | React)
  - Tela de listagem de veículos com fitro de placa
  - Tela de cadastro de motorista com filtro por nome, cpf
  - Tela de criação de viagem
  - Tela de listagem de viagens com filtros: motorista, placa

## Sugestão de modelagem de dados
1. Motorista
```
{
  _id: ObjectId,
  nome: String,
  cpf: String,
  cnh: {
    numero: String,
    validade: Date
  },
  createdAt: Date
  updatedAt: Date
}

```
2. Veículo
```
{
  _id: ObjectId,
  modelo: String,
  placa: String,
  tipo: String, // Caminhão, Van, Carro, etc.
  capacidade: Number, // kg, litros etc.
  createdAt: Date
  updatedAt: Date
}

```
3. Viagem
```
{
  _id: ObjectId,
  origem: String,
  destino: String,
  dataPartida: Date,
  previsaoChegada: Date,
  motorista: ObjectId, // referência para Driver
  veiculo: ObjectId,   // referência para Vehicle
  status: String, // Planejada, Em andamento, Concluída, Cancelada
  createdAt: Date
  updatedAt: Date
}

```

## Tecnologias 
- Backend: Node.js, Express
- Banco de dados: MongoDB (mongoose)
- Cache: Redis (opcional)
- Mensageria: RabbitMQ (opcional)
- Frontend: Next.js | React (livre para usar Tailwind, Material UI etc.)

# Critérios de avaliação
- Organização do código e estrutura do projeto
- Boas práticas RESTful
- UX/UI no frontend
- README documentado

# Diferenciais
- Autenticação com JWT
- Testes unitarios, integração.
- Utilização de Redis
- Utilização de Rabbit
- Validações com middleware (ex: CNH vencida não pode criar viagem)
- Docker e docker-compose para subir todos os serviços
- Documentação da API com Swagger ou Postman

# Exemplo de Fluxo (simples)
- O usuário acessa o sistema e cadastra motoristas e veículos.
- O usuário cria uma viagem com os dados acima.
- A viagem é salva no banco de dados.
- O serviço publica uma mensagem no RabbitMQ com os dados da viagem.
- Um worker consome a mensagem e simula o envio de notificação via console.log.
- O usuário pode listar todas as viagens de um determinado motorista.

# Entrega
Link para o repositório no GitHub
README com:
- Instruções de execução
- Scripts para subir o ambiente (preferencialmente com Docker)
- Descrição das funcionalidades
- Observações sobre pontos não finalizados (se houver)