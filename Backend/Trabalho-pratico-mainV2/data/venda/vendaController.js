// data/venda/vendaController.js

const Produto = require("../produto/produto"); // Importando o modelo Produto

function vendaController(VendaModel) {
  const controller = {};

  controller.getAllVendas = async (req, res) => {
    try {
      const vendas = await VendaModel.find().populate("produtos.produto");
      res.status(200).json(vendas);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar vendas", error });
    }
  };

  controller.createVenda = async (req, res) => {
    const { cliente, produtos, total, estado } = req.body;

    if (!cliente || !produtos || produtos.length === 0 || !total || !estado) {
      return res
        .status(400)
        .json({ message: "Dados incompletos para criar a venda" });
    }

    try {
      const nrVenda = Math.floor(Math.random() * 1000000);

      const venda = new VendaModel({
        nrVenda,
        cliente,
        produtos,
        total,
        estado,
      });

      await venda.save();
      res.status(201).json(venda);
    } catch (error) {
      if (error.code === 11000) {
        res
          .status(409)
          .json({
            message: "Erro de chave duplicada: ref de produto deve ser único.",
            error,
          });
      } else {
        res.status(500).json({ message: "Erro ao criar venda", error });
      }
    }
  };

  controller.addProdutoAoCarrinho = async (req, res) => {
    const { cliente, produtoId, quantidade } = req.body;
    console.log("Dados recebidos para adicionar ao carrinho:", req.body);

    try {
      let venda = await VendaModel.findOne({
        cliente,
        estado: "Carrinho",
      }).populate("produtos.produto");
      console.log("Venda encontrada:", venda);

      if (!venda) {
        venda = new VendaModel({
          nrVenda: Math.floor(Math.random() * 1000000),
          cliente,
          produtos: [],
          total: 0,
          estado: "Carrinho",
        });
        console.log("Nova venda criada:", venda);
      }

      const produtoExistenteIndex = venda.produtos.findIndex(
        (p) => p.produto._id.toString() === produtoId
      );
      if (produtoExistenteIndex !== -1) {
        venda.produtos[produtoExistenteIndex].quantidade += quantidade;
      } else {
        const produto = await Produto.findById(produtoId);
        if (!produto) {
          return res.status(404).json({ message: "Produto não encontrado" });
        }

        venda.produtos.push({
          produto: produto._id,
          quantidade,
        });
      }

      venda.produtos = venda.produtos.filter((p) => p.produto !== null);

      // Populando produtos antes de calcular o total
      await VendaModel.populate(venda, { path: "produtos.produto" });
      venda.total = venda.produtos.reduce(
        (acc, p) => acc + p.produto.preco * p.quantidade,
        0
      );

      await venda.save();
      res.status(200).json(venda);
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      res
        .status(500)
        .json({ message: "Erro ao adicionar produto ao carrinho", error });
    }
  };

  controller.updateQuantidadeProdutoNoCarrinho = async (req, res) => {
    const { cliente, produtoId, quantidade } = req.body;

    try {
      let venda = await VendaModel.findOne({ cliente, estado: "Carrinho" });

      if (!venda) {
        return res.status(404).json({ message: "Carrinho não encontrado" });
      }

      const produtoExistente = venda.produtos.find(
        (p) => p.produto.toString() === produtoId
      );

      if (produtoExistente) {
        produtoExistente.quantidade = quantidade;
        await venda.save();
        res.status(200).json(venda);
      } else {
        res.status(404).json({ message: "Produto não encontrado no carrinho" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Erro ao atualizar quantidade do produto no carrinho",
          error,
        });
    }
  };

  controller.removeProdutoDoCarrinho = async (req, res) => {
    const { cliente, produtoId } = req.body;

    try {
      let venda = await VendaModel.findOne({ cliente, estado: "Carrinho" });

      if (!venda) {
        return res.status(404).json({ message: "Carrinho não encontrado" });
      }

      venda.produtos = venda.produtos.filter(
        (p) => p.produto.toString() !== produtoId
      );

      await venda.save();
      res.status(200).json(venda);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao remover produto do carrinho", error });
    }
  };

  return controller;
}

module.exports = vendaController;
