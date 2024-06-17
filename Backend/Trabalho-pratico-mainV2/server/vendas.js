const express = require("express");
const bodyParser = require("body-parser");
const Venda = require("../data/venda/venda"); 
const vendaController = require("../data/venda/vendaController")(Venda);

const vendasRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(vendaController.getAllVendas)
        .post(vendaController.createVenda);

    router.route("/carrinho/add")
        .post(vendaController.addProdutoAoCarrinho);

    router.route("/carrinho/update")
        .put(vendaController.updateQuantidadeProdutoNoCarrinho);

    router.route("/carrinho/remove")
        .post(vendaController.removeProdutoDoCarrinho);

    return router;
};

module.exports = vendasRouter;
