# Technical Challenge
  Passo a passo para inicialização do projeto.
  Obs: para descrição do desafio leia o arquivo [technicalChallenge.md](./technicalChallenge.md)

## Execução
- Criar arquivo .env na raiz do projeto com 
  ```
  JWT_SECRET=seusegredo
  ```

- Rodar docker engine

- Subir aplicações via docker
  ```
  docker-compose up
  ```
  
- Executar docker compose do serviço de seed caso seja a primeira vez rodando o projeto
  ```
  docker-compose -f docker-compose-seed.yml up
  ```

- Acessar o site em http://localhost:4173
- Ou acessar a API em http://localhost:4000