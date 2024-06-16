const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router");
const config = require("./config");

const app = express();
const server = http.Server(app);

const hostname = "127.0.0.1";
const port = 3001;

// Configurações do CORS
const corsOptions = {
  origin: "http://127.0.0.1:3000",
  credentials: true,
};

// Inicialização do servidor
app.use(cors(corsOptions));
app.use(router.initialize());

// Conexão ao banco de dados MongoDB
mongoose.connect(config.db)
  .then(() => console.log("Conexão estabelecida com o MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Inicialização do servidor
server.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
