# 🍔 MyRango delivery

Aplicação completa de delivery, desenvolvida do zero com **frontend** e **backend**.  
O usuário pode se cadastrar, logar, adicionar/remover itens do carrinho, escolher endereço de entrega, finalizar pedidos e acompanhar o status em tempo real.

---

## 🚀 Tecnologias
- **Frontend:** React + TypeScript + TailwindCSS + CSS
- **Backend:** Node.js + Express + MongoDB
- **Autenticação:** JWT

---

## 📂 Estrutura do Projeto
delivery-app/
│── frontend/ # Aplicação React (UI)
│── backend/ # API RESTful (Express + MongoDB)
└── README.md

---

## ⚙️ Como Rodar

### 🔹 Clonar o repositório
```bash
git clone https://github.com/seu-usuario/delivery-app.git
cd delivery-app
```

🔹 Backend
Entrar na pasta do backend:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Configurar variáveis de ambiente:
Crie um arquivo .env na pasta backend/ com:

```
MONGO_URI=sua_string_do_mongodb
JWT_SECRET=umseguroaleatorio
```
O servidor roda na porta 3000, mas pode ser alterado

Rodar o servidor:

```bash
npm run dev
```

👉 API disponível em http://localhost:3000

🔹 Frontend
Entrar na pasta do frontend:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Configurar variáveis de ambiente:
Crie um arquivo .env na pasta frontend/ com:

```
VITE_API_URL=http://localhost:5000
```

Rodar o app:

```bash
npm run dev
```

👉 Acesse em http://localhost:5173

---

🛒 Funcionalidades
 Cadastro e login com validação de CPF

 Endereços (criar, visualizar e excluir)

 Produtos com carrinho (adicionar/remover itens)

 Finalização de pedido (endereço + botao para simular o pagamento)

 Histórico de pedidos com status e total gasto


📌 Melhorias Futuras
Integração com gateway de pagamento real

Dashboard para restaurante acompanhar pedidos

👨‍💻 Autor
Desenvolvido por Edson Junior 🚀


---