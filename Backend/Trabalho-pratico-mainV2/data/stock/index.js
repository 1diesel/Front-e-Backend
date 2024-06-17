const Stock = require("./stock");
const stockController = require("./stockController")(Stock);

module.exports = stockController;
