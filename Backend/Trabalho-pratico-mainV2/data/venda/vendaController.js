function vendaController(VendaModel) {
    const controller = {};

    controller.getAllVendas = async (req, res) => {
        try {
            const vendas = await VendaModel.find().populate('produtos.produto');
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
                nrVenda: Math.floor(Math.random() * 1000000),
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

    controller.addProdutoAoCarrinho = async (req, res) => {
        const { cliente, produtoId, quantidade } = req.body;

        try {
            let venda = await VendaModel.findOne({ cliente, estado: "Carrinho" });

            if (!venda) {
                venda = new VendaModel({
                    nrVenda: Math.floor(Math.random() * 1000000),
                    cliente,
                    produtos: [],
                    total: 0,
                    estado: "Carrinho"
                });
            }

            const produtoExistente = venda.produtos.find(p => p.produto.toString() === produtoId);

            if (produtoExistente) {
                produtoExistente.quantidade += quantidade;
            } else {
                venda.produtos.push({ produto: produtoId, quantidade });
            }

            await venda.save();
            res.status(200).json(venda);
        } catch (error) {
            res.status(500).json({ message: "Erro ao adicionar produto ao carrinho", error });
        }
    };

    controller.updateQuantidadeProdutoNoCarrinho = async (req, res) => {
        const { cliente, produtoId, quantidade } = req.body;

        try {
            let venda = await VendaModel.findOne({ cliente, estado: "Carrinho" });

            if (!venda) {
                return res.status(404).json({ message: "Carrinho não encontrado" });
            }

            const produtoExistente = venda.produtos.find(p => p.produto.toString() === produtoId);

            if (produtoExistente) {
                produtoExistente.quantidade = quantidade;
                await venda.save();
                res.status(200).json(venda);
            } else {
                res.status(404).json({ message: "Produto não encontrado no carrinho" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar quantidade do produto no carrinho", error });
        }
    };

    controller.removeProdutoDoCarrinho = async (req, res) => {
        const { cliente, produtoId } = req.body;

        try {
            let venda = await VendaModel.findOne({ cliente, estado: "Carrinho" });

            if (!venda) {
                return res.status(404).json({ message: "Carrinho não encontrado" });
            }

            venda.produtos = venda.produtos.filter(p => p.produto.toString() !== produtoId);

            await venda.save();
            res.status(200).json(venda);
        } catch (error) {
            res.status(500).json({ message: "Erro ao remover produto do carrinho", error });
        }
    };

    return controller;
}

module.exports = vendaController;
