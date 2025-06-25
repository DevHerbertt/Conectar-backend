# Conectár - Backend (NestJS)
Este é o backend da aplicação de gerenciamento de usuários desenvolvida como parte do desafio técnico da Conectár.

# Funcionalidades Implementadas
Autenticação: Registro de usuários (/auth/register) e Login (/auth/login) com JWT.

Gerenciamento de Usuários (CRUD): Operações para criar, listar, atualizar e excluir usuários.

Controle de Acesso: Proteção de rotas para administradores (admin) utilizando Guards e Roles personalizados.

Filtragem e Ordenação: Possibilidade de filtrar usuários por nome, role, e ordenar por ID, nome, e-mail, data de criação e último login.

Status de Atividade: Endpoint para identificar usuários inativos (sem login nos últimos 30 dias), com atualização do lastLogin no login.

# Tecnologias Utilizadas
Framework: NestJS

Linguagem: TypeScript

Banco de Dados: PostgreSQL

ORM: TypeORM

Autenticação: JWT (@nestjs/jwt, passport-jwt, bcrypt)

Documentação API: Swagger (@nestjs/swagger)

# Como Configurar e Executar
Pré-requisitos
Node.js (v18 ou superior recomendado)

npm ou Yarn

Docker (opcional, para rodar PostgreSQL facilmente) ou uma instância de PostgreSQL rodando localmente.

Configuração do Banco de Dados (PostgreSQL)
Certifique-se de ter uma instância de PostgreSQL rodando.

## Exemplo com Docker:

docker run --name pg-conectardb -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=Herbert9966 -e POSTGRES_DB=conectar_db -p 5050:5432 -d postgres

(Ajuste as credenciais e porta conforme a sua configuração no app.module.ts).

O TypeORM está configurado com synchronize: true para criar automaticamente as tabelas ao iniciar (apenas para desenvolvimento).

# Instalação e Execução
Clone este repositório:

git clone https://github.com/DevHerbertt/Conectar-backend.git

Navegue até a pasta do projeto:

cd Conectar-backend

Instale as dependências:

npm install

ou

yarn

Crie um arquivo .env na raiz do projeto e adicione a chave secreta do JWT:

JWT_SECRET=UM_SEGREDO_MUITO_FORTE_E_ALEATORIO

(Use uma string longa e complexa. Esta deve ser a mesma no backend e frontend para validação JWT).

# Inicie o servidor em modo de desenvolvimento:

npm run start:dev

ou

yarn start:dev

## O backend estará rodando em http://localhost:3000.

# Documentação da API (Swagger)
A documentação interativa da API está disponível em:
http://localhost:3000/api (ou a rota que você configurou no main.ts para o Swagger).

# Decisões de Design e Arquitetura
NestJS: Escolhido pela sua arquitetura modular, uso de injeção de dependência e suporte robusto a TypeScript, o que facilita a escalabilidade e a manutenção.

TypeORM: Utilizado para mapeamento objeto-relacional, permitindo interações com o banco de dados de forma orientada a objetos e segura contra SQL Injection.

JWT para Autenticação: Padrão da indústria para autenticação stateless, proporcionando segurança e escalabilidade.

Guards e Decorators Personalizados: Implementados para um controle de acesso baseado em roles (RBAC) claro e fácil de aplicar em rotas e controllers.

Separação de Responsabilidades: O código é organizado em módulos (AuthModule, UsersModule, AdminModule) e camadas (controllers, services, entities, DTOs) para promover a legibilidade e a manutenibilidade.

Tratamento de Erros: Exceções HTTP do NestJS são utilizadas para fornecer respostas padronizadas e claras em caso de erros.
