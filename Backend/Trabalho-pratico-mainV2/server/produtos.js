const express = require("express");
const bodyParser = require("body-parser");
const produtoController = require("../data/produto");

const produtoRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(produtoController.getAll)
        .post(produtoController.create);

    router.route("/:id")
        .get(produtoController.getById)
        .put(produtoController.update)
        .delete(produtoController.delete);

    return router;
};

module.exports = produtoRouter;
