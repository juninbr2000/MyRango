const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const http = require("http");
require('dotenv').config()

const app = express()
app.use(cors(
  {origin: [
    "http://192.168.0.114:5173",
    "http://localhost:5173"
    ]
  }
))
app.use(express.json())

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.error("Erro ao se conectar com o banco de dados", err));

app.get('/', (req, res) => {
  res.status(200).json({message: 'API Chamada'})
})

const userRoute = require('./routes/UserRoute');
const AddressRoute = require('./routes/AddressRoute')
const ProductRouter = require('./routes/ProductsRoute')
const OrderRouter = require('./routes/OrderRoute')

app.use('/user', userRoute)
app.use('/address', AddressRoute)
app.use('/product', ProductRouter)
app.use('/order', OrderRouter)

const server = http.createServer(app);

const { initializeSocket } = require("./socket/socket");

const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
