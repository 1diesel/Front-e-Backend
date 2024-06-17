function stockController(StockModel) {
    let controller = {};

    controller.getAll = async (req, res, next) => {
        try {
            const stockItems = await StockModel.find().populate('idProduto');
            res.json(stockItems);
        } catch (err) {
            next(err);
        }
    };

    controller.create = async (req, res, next) => {
        try {
            const stockItem = new StockModel(req.body);
            await stockItem.save();
            res.status(201).json(stockItem);
        } catch (err) {
            next(err);
        }
    };

    return controller;
}

module.exports = stockController;
