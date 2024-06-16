const Produto = require("./produto");
const produtoController = require("./produtoController")(Produto);

module.exports = produtoController;
