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