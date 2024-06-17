const express = require("express");
const bodyParser = require("body-parser");
const stockController = require("../data/stock");

const stockRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(stockController.getAll)
        .post(stockController.create);

    return router;
};

module.exports = stockRouter;
