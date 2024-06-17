const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router");
const config = require("./config");
const path = require("path");
const bodyParser = require("body-parser");
const vendasRouter = require("./server/vendas"); // Import the vendasRouter
const authRouter = require("./server/auth"); // Ensure the auth router is correctly imported

const app = express();
const server = http.Server(app);

const hostname = "127.0.0.1";
const port = 3001;

const corsOptions = {
  origin: "http://127.0.0.1:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(router.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json({ limit: "10mb" })); // Aumenta o limite de tamanho da carga útil
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use("/vendas", vendasRouter()); // Initialize vendas router with the correct function call
app.use("/auth", authRouter()); // Initialize auth router

mongoose
  .connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexão estabelecida com o MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

server.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
