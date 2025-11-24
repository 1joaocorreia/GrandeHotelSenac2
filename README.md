# Grande Hotel Senac – Sistema de Reservas

Aplicação web full stack para gerenciamento de reservas do **Grande Hotel Senac**, composta por:

- **Front-end SPA** em HTML, CSS (Bootstrap + estilo próprio) e JavaScript modular.
- **Back-end em PHP** com rotas REST simples.
- **Banco de dados MySQL/MariaDB**, com script de criação disponível em `dbhotel.sql`.
- **Autenticação via JWT** para acesso a recursos protegidos.

---

## 📁 Estrutura do Projeto

Visão geral das principais pastas e arquivos:

- `.htaccess`  
  Arquivo de configuração do Apache para habilitar o roteamento amigável via `index.php`.

- `index.php`  
  Front controller da aplicação em PHP.  
  - Encaminha requisições para:
    - `public/index.html` (front-end SPA) quando a rota **não** é `/api`.
    - Arquivos em `routes/` quando a rota começa com `/api/...`.

- `dbhotel.sql`  
  Script de criação e povoamento do banco **`dbhotel`**.

- `config/`
  - `config.php` – constantes de configuração (host, usuário, senha, nome do banco, `SECRET_KEY` do JWT).
  - `database.php` – conexão com MySQL/MariaDB e controle de erro (`$conn`, `$errorDB`).

- `controllers/`  
  Contém a lógica de negócio de cada recurso (quartos, reservas, clientes etc.) consumida pelas rotas em `routes/`.

- `models/`  
  Classes responsáveis pelo acesso direto ao banco de dados (CRUD e consultas específicas).

- `helpers/`
  - `response.php` – função `jsonResponse` para retorno padronizado em JSON.
  - `token_jwt.php` – criação e validação de tokens JWT.
  - `helpers/jwt/` – biblioteca JWT (Firebase PHP JWT).

- `routes/`  
  Definição das rotas da API:
  - `login.php`
  - `rooms.php`
  - `reserve.php`
  - `client.php`
  - `addon.php`
  - `request.php`
  - `upload.php`

- `public/`
  - `index.html` – página base do front-end SPA.
  - `assets/images/` – imagens de quartos, áreas comuns, ícones etc.

- `src/`
  - `src/main.js` – roteador simples em JavaScript que renderiza as páginas da SPA.
  - `src/pages/` – páginas principais (`Home.js`, `Login.js`, `Register.js`, `Rooms.js`, `Cart.js`).
  - `src/components/` – componentes reutilizáveis (Navbar, Hero, cards, modais, seletor de datas etc.).
  - `src/api/` – funções de acesso à API (`authAPI.js`, `roomsAPI.js`, `clientAPI.js`, `reserveAPI.js`).
  - `src/store/CartStore.js` – controle do carrinho de reservas no front.
  - `src/css/global.css` – estilos customizados da aplicação.

- `uploads/`
  Pasta de upload de imagens (ex.: fotos de quartos).

---

## 🧩 Funcionalidades Principais

- **Autenticação**
  - Login com e-mail e senha.
  - Geração de token JWT pelo back-end.
  - Armazenamento e uso do token no front-end para acessar rotas protegidas.

- **Gestão de Quartos**
  - Listagem de quartos.
  - Filtro de quartos disponíveis por período e capacidade.
  - Exibição de informações detalhadas (descrição, capacidade, imagens).

- **Carrinho de Reservas**
  - Seleção de quartos e datas.
  - Armazenamento das escolhas no front-end (store).
  - Envio da reserva consolidada para a API.

- **Clientes**
  - Cadastro de novos clientes.
  - Integração com reservas para associar cliente às reservas realizadas.

- **Adicionais e Serviços**
  - Gestão de itens adicionais vinculados à reserva (ex.: serviços extras).

- **Upload de Imagens**
  - Endpoint dedicado para upload de imagens de quartos/estrutura do hotel.

---

## 🏗 Arquitetura da Aplicação

### Back-end (PHP + MySQL/MariaDB)

- Ponto de entrada: `index.php`.
- Roteamento:
  - Rotas que **não** começam com `/api` carregam `public/index.html` para o front-end SPA.
  - Rotas que começam com `/api/...` são enviadas para o arquivo correspondente em `routes/`.
- As rotas chamam controladores em `controllers/`, que utilizam modelos em `models/`.
- O padrão de resposta é JSON, usando a função `jsonResponse` definida em `helpers/response.php`.
- Autenticação JWT:
  - Tokens gerados em `helpers/token_jwt.php`.
  - `SECRET_KEY` definida em `config/config.php`.

### Front-end (SPA em JS + Bootstrap)

- `public/index.html` carrega:
  - Bootstrap CSS/JS.
  - `src/css/global.css`.
  - `src/main.js` como módulo ES.
- `src/main.js`:
  - Define as rotas da SPA (`/home`, `/login`, `/register`, `/cart`, `/room`).
  - Identifica o caminho atual com `location.pathname` e renderiza a página correspondente.
- Cada página em `src/pages/` constrói dinamicamente o DOM usando componentes em `src/components/`.
- Comunicação com a API via `fetch`, centralizada nos arquivos de `src/api/`.

---

## 🛠 Tecnologias Utilizadas

- **Front-end**
  - HTML5
  - CSS3
  - Bootstrap
  - JavaScript (ES Modules)

- **Back-end**
  - PHP 8+
  - Extensão `mysqli`
  - Biblioteca Firebase JWT (PHP)

- **Banco de Dados**
  - MySQL ou MariaDB
  - Script: `dbhotel.sql`

- **Servidor Web**
  - Apache (recomendado)
  - Módulo `mod_rewrite` ativo (para `.htaccess`)

---

## ✅ Pré-requisitos

- PHP 8.x
- MySQL/MariaDB
- Servidor Apache com `mod_rewrite` habilitado  
  (pode ser via XAMPP/WAMP/Laragon ou servidor Linux configurado manualmente).

---

## ⚙️ Configuração do Ambiente

1. **Clonar ou copiar o projeto**

   Coloque a pasta do projeto dentro do diretório público do seu servidor web.  
   Exemplo no XAMPP (Windows):

   - Caminho: `C:\xampp\htdocs\grandehotelsenac`

2. **Criar o banco de dados**

   - Inicie MySQL/MariaDB.
   - Importe o arquivo `dbhotel.sql` no phpMyAdmin ou via terminal:
     - O arquivo já cria o banco `dbhotel` e as tabelas necessárias.

3. **Configurar a conexão com o banco**

   Edite `config/config.php` se necessário:

   - `DB_HOST` – geralmente `localhost`.
   - `DB_USER` – usuário do banco (padrão do XAMPP é `root`).
   - `DB_PASS` – senha do banco (vazia por padrão no XAMPP).
   - `DB_NAME` – deve ser `dbhotel` (como no script).
   - `SECRET_KEY` – chave secreta usada para assinatura dos tokens JWT.

4. **Verificar `.htaccess`**

   O arquivo `.htaccess` está configurado com:

   - `RewriteBase /grandehotelsenac/`

   Se a pasta do projeto tiver outro nome ou for publicada em outro caminho, ajuste essa linha para refletir o novo path.

---

## ▶️ Executando o Projeto

1. Inicie Apache e MySQL/MariaDB.
2. Acesse no navegador:

   - `http://localhost/grandehotelsenac/`

   Isso carregará a SPA em `public/index.html` via `index.php`.

3. A API estará disponível em rotas como:

   - `http://localhost/grandehotelsenac/api/login`
   - `http://localhost/grandehotelsenac/api/rooms`
   - `http://localhost/grandehotelsenac/api/reserve`
   - etc.

---

## 🌐 Principais Endpoints da API

Os endpoints são definidos em `routes/` e consumidos pelos arquivos em `src/api/`.

- `POST /api/login`  
  - Autentica usuário (cliente ou funcionário).
  - Retorna token JWT e informações básicas de usuário.

- `GET /api/rooms`  
  - Lista todos os quartos cadastrados.

- `GET /api/rooms/{id}`  
  - Retorna dados de um quarto específico.

- `GET /api/rooms/disponiveis?inicio=YYYY-MM-DD&fim=YYYY-MM-DD&capacidadeTotal=N`  
  - Busca quartos disponíveis por janela de data e capacidade.

- `POST /api/client`  
  - Cadastro de cliente.

- `POST /api/reserve`  
  - Criação de reserva a partir dos dados do carrinho (lista de quartos, datas etc.).

- `GET /api/request` / `POST /api/request`  
  - Controle de requisições relacionadas a reservas (detalhes dependem da implementação interna).

- `POST /api/addon`  
  - Cadastro ou vinculação de adicionais/serviços à reserva.

- `POST /api/upload`  
  - Upload de imagens (ex.: fotos de quartos).

Alguns endpoints exigem envio de token JWT no cabeçalho `Authorization` com o formato `Bearer {token}`.

---

## 🧪 Fluxo de Uso (Visão Geral)

1. Usuário acessa `/home` e visualiza os quartos e estrutura do hotel.
2. Faz login ou cadastro (`/login` ou `/register`).
3. Seleciona quartos, datas e adiciona ao carrinho (`/room` + `/cart`).
4. Confirma a reserva, que é enviada para `POST /api/reserve`.
5. Back-end registra a reserva no banco `dbhotel` e retorna o status para a SPA.

---

## 👩‍🏫 Notas para uso didático

Este projeto é especialmente adequado para fins educacionais, pois demonstra:

- Integração completa **front-end ↔ back-end ↔ banco de dados**.
- Implementação de rotas REST simples em PHP.
- Utilização de **JWT** para autenticação em APIs.
- Criação de uma **SPA sem frameworks**, apenas com JavaScript modular e Bootstrap.
- Organização de código em camadas (controllers, models, helpers, rotas).

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos e didáticos.
