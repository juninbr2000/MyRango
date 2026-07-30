# 🍔 MyRango delivery

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-Realtime-black?logo=socketdotio)](https://socket.io/)

Aplicação completa de delivery para pedidos de refeições, desenvolvida do zero (**Fullstack**).

O usuário pode se cadastrar, autenticar com segurança, gerenciar múltiplos endereços com autocompletar via ViaCEP, montar seu carrinho de compras e **acompanhar o status do pedido em tempo real** através de WebSockets.

---

## 🚀 Tecnologias

### **Frontend**
- **Core:** React, TypeScript, Vite
- **Estilização:** Tailwind CSS, React Icons
- **Comunicação & Estado:** Axios, Socket.IO Client, React Router DOM

### **Backend**
- **Core:** Node.js, Express, JavaScript
- **Banco de Dados:** MongoDB (Mongoose)
- **Realtime:** Socket.IO
- **Segurança:** JWT (JSON Web Tokens), Helmet, Express Rate Limit, Cors

---

## 📂 Estrutura do Projeto
```
delivery-app/
│── frontend/ # Aplicação React (UI)
│── backend/ # API RESTful (Express + MongoDB)
└── README.md
```

---

## ⚙️ Como Rodar

### 🔹 Clonar o repositório
```bash
git clone https://github.com/seu-usuario/delivery-app.git
cd delivery-app
```

### 🔹 Backend
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
JWT_SECRET=umsegredoaleatorio
```
O servidor roda na porta 3000, mas caso queira, basta adicionar uma porta ao .env:

```
PORT=1234
```

Rodar o servidor:

```bash
npm run dev
```

👉 API disponível em http://localhost:3000

### 🔹 Frontend
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
VITE_API_URL=http://localhost:3000
```

Rodar o app:

```bash
npm run dev
```

👉 Acesse em http://localhost:5173

---

## 🛒 Funcionalidades
 Cadastro e login com validação de CPF

 Endereços (criar, editar, visualizar e excluir)

 Produtos com carrinho (adicionar/remover itens)

 Finalização de pedido (endereço + opção de pagamento(ficticios) )

 Histórico de pedidos com status e total gasto

---

## 🔄 Últimos Updates
 Reformulação completa de UI/UX com Tailwind CSS responsivo.

 Proteção contra ataques com Rate Limit e Helmet no servidor.

 Integração com WebSockets para mudança de status em tempo real.

 Fluxo de criação e edição dinâmica de endereços integrados com API externa.

---

## 📌 Melhorias Futuras
Integração com gateway de pagamento real

Dashboard para restaurante acompanhar pedidos

---

## 👨‍💻 Autor

**Edson Junior**

- Portfolio: https://juninbr2000.github.io/portfolio/
- LinkedIn: https://www.linkedin.com/in/edson-junior-918171272/
- GitHub: https://github.com/juninbr2000