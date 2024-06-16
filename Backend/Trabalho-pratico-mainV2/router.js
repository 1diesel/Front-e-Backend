const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

let AuthAPI = require("./server/auth");
let ProdutoAPI = require("./server/produtos");
let StockAPI = require("./server/stock");
let UtilizadorAPI = require("./server/utilizadores");
let VendaAPI = require("./server/vendas");

function initialize() {
    let api = express();

    api.use(cors());
    api.use(bodyParser.json());

    api.use("/auth", AuthAPI());
    api.use("/produtos", ProdutoAPI());
    api.use("/stock", StockAPI());
    api.use("/menu", UtilizadorAPI());
    api.use("/vendas", VendaAPI());

    return api;
}

module.exports = { initialize: initialize };
