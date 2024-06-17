// server/vendas.js

const express = require("express");
const bodyParser = require("body-parser");
const Venda = require("../data/venda/venda"); 
const vendaController = require("../data/venda/vendaController")(Venda);

const vendasRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(vendaController.getAllVendas) // Check if getAllVendas is properly defined
        .post(vendaController.createVenda); // Check if createVenda is properly defined

    router.route("/carrinho/add")
        .post(vendaController.addProdutoAoCarrinho); // Check if addProdutoAoCarrinho is properly defined

    router.route("/carrinho/update")
        .put(vendaController.updateQuantidadeProdutoNoCarrinho); // Check if updateQuantidadeProdutoNoCarrinho is properly defined

    router.route("/carrinho/remove")
        .post(vendaController.removeProdutoDoCarrinho); // Check if removeProdutoDoCarrinho is properly defined

    return router;
};

module.exports = vendasRouter;
