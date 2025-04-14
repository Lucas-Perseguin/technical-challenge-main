# Technical Challenge
  Passo a passo para inicialização do projeto.
  Obs: para descrição do desafio leia o arquivo [technicalChallenge.md](./technicalChallenge.md)

## Execução

- Subir banco de dados mongo via docker 
  ```
  docker-compose up
  ```
- Instalar dependecias frontend
  ```
  cd frontend/
  npm i
  ```

- Instalar dependecias backend
  ```
  cd backend/
  npm i
  ```

- Criar arquivo .env no projeto backend

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
