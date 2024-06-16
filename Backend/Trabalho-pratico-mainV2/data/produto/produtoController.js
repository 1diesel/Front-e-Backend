function produtoController(ProdutoModel) {
    let controller = {};

    controller.getAll = async (req, res, next) => {
        try {
            const produtos = await ProdutoModel.find();
            res.json(produtos);
        } catch (err) {
            next(err);
        }
    };

    controller.create = async (req, res, next) => {
        try {
            const produto = await ProdutoModel.create(req.body);
            res.status(201).json(produto);
        } catch (err) {
            next(err);
        }
    };

    controller.getById = async (req, res, next) => {
        try {
            const produto = await ProdutoModel.findById(req.params.id);
            if (!produto) {
                res.status(404).send("Produto não encontrado");
                return;
            }
            res.json(produto);
        } catch (err) {
            next(err);
        }
    };

    controller.update = async (req, res, next) => {
        try {
            const produto = await ProdutoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!produto) {
                res.status(404).send("Produto não encontrado");
                return;
            }
            res.json(produto);
        } catch (err) {
            next(err);
        }
    };

    controller.delete = async (req, res, next) => {
        try {
            const produto = await ProdutoModel.findByIdAndDelete(req.params.id);
            if (!produto) {
                res.status(404).send("Produto não encontrado");
                return;
            }
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    };

    return controller;
}

module.exports = produtoController;