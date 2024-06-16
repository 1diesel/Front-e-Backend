function vendaController(VendaModel) {
    const controller = {};

    controller.getAllVendas = async (req, res) => {
        try {
            const vendas = await VendaModel.find().populate('produtos');
            res.status(200).json(vendas);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar vendas", error });
        }
    };

    controller.createVenda = async (req, res) => {
        const { cliente, produtos, total, estado } = req.body;

        if (!cliente || !produtos || produtos.length === 0 || !total || !estado) {
            return res.status(400).json({ message: "Dados incompletos para criar a venda" });
        }

        try {
            const venda = new VendaModel({
                nrVenda: Math.floor(Math.random() * 1000000), // Gera um número de venda aleatório
                cliente,
                produtos,
                total,
                estado
            });

            await venda.save();
            res.status(201).json(venda);
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar venda", error });
        }
    };

    return controller;
}

module.exports = vendaController;
