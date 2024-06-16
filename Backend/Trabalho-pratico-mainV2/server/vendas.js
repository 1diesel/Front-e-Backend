const express = require("express");
const bodyParser = require("body-parser");
const Venda = require("../data/venda/venda");
const vendaController = require("../data/venda/vendaController")(Venda);

const vendasRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(async (req, res, next) => {
            try {
                const vendas = await vendaController.getAllVendas(req, res);
            } catch (err) {
                next(err);
            }
        })
        .post(async (req, res, next) => {
            try {
                const venda = await vendaController.createVenda(req, res);
            } catch (err) {
                next(err);
            }
        });

    return router;
};

module.exports = vendasRouter;
