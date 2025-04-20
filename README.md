# Technical Challenge
  Passo a passo para inicialização do projeto.
  Obs: para descrição do desafio leia o arquivo [technicalChallenge.md](./technicalChallenge.md)

## Execução
- Criar arquivo .env no projeto com JWT_SECRET

- Rodar docker engine

- Subir aplicações via docker
  ```
  docker-compose up
  ```
  

- Executar script seed para alimentar collections no mongo
  ```
  npm run seed
  ```

- Executar frontend
  ```
  npm run dev
  ```
- Executar backend
  ```
  npm run start
  ```
