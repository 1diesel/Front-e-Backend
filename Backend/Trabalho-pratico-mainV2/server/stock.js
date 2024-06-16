const express = require("express");
const bodyParser = require("body-parser");
const Stock = require("../data/stock/stock");

const stockRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(async (req, res, next) => {
            try {
                const stock = await Stock.find();
                res.json(stock);
            } catch (err) {
                next(err);
            }
        })
        .post(async (req, res, next) => {
            try {
                const stockItem = await Stock.create(req.body);
                res.status(201).json(stockItem);
            } catch (err) {
                next(err);
            }
        });

    return router;
};

module.exports = stockRouter;