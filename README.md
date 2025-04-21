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
  
- Caso seja a primeira vez rodando o projeto
  - Criar arquivo .env na pasta seed com
    ```
    ADMIN_NOME=NomeDoPerfilAdmin
    ADMIN_EMAIL=EmailDoPerfilAdmin
    ADMIN_CPF=CpfDoPerfilAdmin
    ADMIN_SENHA=SenhaDoPerfilAdmin
    ```
  - Rodar docker compose do serviço de seed
    ```
    docker-compose -f docker-compose-seed.yml up
    ```

- Acessar o site em http://localhost:4173
- Ou acessar a API em http://localhost:4000

- Para rodar testes
  - Rodar docker compose dos serviços para teste
    ```
    docker-compose -f docker-compose-test.yml up
    ```
  - Criar arquivo .env.test com
    ```
    MONGO_URI=mongodb://localhost:27017/logistica_test
    REDIS_HOST=redis://localhost:6379
    RABBIT_URL=amqp://localhost
    PORT=4000
    JWT_SECRET=seusegredo
    ```
  - Rodar testes com um dos comandos seguintes
    ```
    yarn run test
    yarn run test:coverage
    ```