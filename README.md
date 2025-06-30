# 🚀 Conectár - Backend (NestJS)

Backend da aplicação de gerenciamento de usuários para o desafio técnico da Conectár.

---

## ✨ Funcionalidades

- **Autenticação:**
  - Registro de usuários: `POST /auth/register`
  - Login: `POST /auth/login` (JWT)
- **Gerenciamento de Usuários (CRUD):**
  - Criar, listar, atualizar e excluir usuários
- **Controle de Acesso:**
  - Proteção de rotas para administradores (`admin`) com Guards e Roles personalizados
- **Filtragem e Ordenação:**
  - Filtrar usuários por nome, role
  - Ordenar por ID, nome, e-mail, data de criação e último login
- **Status de Atividade:**
  - Endpoint para identificar usuários inativos (sem login nos últimos 30 dias)
  - Atualização do `lastLogin` no login

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Autenticação:** JWT (`@nestjs/jwt`, `passport-jwt`, `bcrypt`)
- **Documentação API:** Swagger (`@nestjs/swagger`)

---

## ⚙️ Configuração e Execução

### Pré-requisitos

- Node.js (v18 ou superior recomendado)
- npm ou Yarn
- Docker (opcional, para rodar PostgreSQL facilmente) **ou** uma instância de PostgreSQL local

### Configuração do Banco de Dados (PostgreSQL)

> Certifique-se de ter uma instância de PostgreSQL rodando.

#### Exemplo com Docker:

```bash
docker run --name pg-conectardb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Herbert9966 \
  -e POSTGRES_DB=conectar_db \
  -p 5050:5432 -d postgres
```

> Ajuste as credenciais e porta conforme sua configuração no `app.module.ts`.

- O TypeORM está com `synchronize: true` para criar as tabelas automaticamente ao iniciar (apenas para desenvolvimento).

### Instalação e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/DevHerbertt/Conectar-backend.git
   cd Conectar-backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e adicione a chave secreta do JWT:

   ```env
   JWT_SECRET=UM_SEGREDO_MUITO_FORTE_E_ALEATORIO
   ```
   > Use uma string longa e complexa. Esta deve ser a mesma no backend e frontend para validação JWT.

4. **Inicie o servidor em modo de desenvolvimento:**

   ```bash
   npm run start:dev
   # ou
   yarn start:dev
   ```

- O backend estará rodando em: [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentação da API (Swagger)

Acesse a documentação interativa em:

[http://localhost:3000/api](http://localhost:3000/api)

---

## 🏗️ Decisões de Design e Arquitetura

- **NestJS:** Arquitetura modular, injeção de dependência, suporte robusto a TypeScript.
- **TypeORM:** Mapeamento objeto-relacional, interações seguras com o banco de dados.
- **JWT:** Autenticação stateless, segurança e escalabilidade.
- **Guards e Decorators Personalizados:** Controle de acesso baseado em roles (RBAC).
- **Separação de Responsabilidades:** Código organizado em módulos e camadas (controllers, services, entities, DTOs).
- **Tratamento de Erros:** Exceções HTTP do NestJS para respostas padronizadas e claras.

---

## 📝 Observações

- Para ambiente de produção, ajuste as configurações de segurança e variáveis sensíveis.
- Contribuições são bem-vindas!

---

> Desenvolvido para o desafio técnico da Conectár.
