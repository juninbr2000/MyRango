const { Server } = require("socket.io");

let io
console.log("Socket module carregado", __filename);
function initializeSocket(server) {
  console.log('iniciando socket')
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://192.168.0.114:5173",
      ],
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("join-order", (orderId) => {
      socket.join(`order-${orderId}`);

      console.log(`Entrou na sala order-${orderId}`);
    });
    
    socket.on("leave-order", (orderId) => {
      socket.leave(`order-${orderId}`);
      
      console.log(`Saiu da sala order-${orderId}`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  initializeSocket,
  getIO,
};
