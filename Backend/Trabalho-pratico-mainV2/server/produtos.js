// server/produtos.js

const express = require("express");
const bodyParser = require("body-parser");
const Produto = require("../data/produto/produto");

const produtoRouter = () => {
  let router = express.Router();

  router.use(bodyParser.json({ limit: "10mb" }));

  // Rota para listar todos os produtos e adicionar um novo produto
  router
    .route("/")
    .get(async (req, res, next) => {
      try {
        const produtos = await Produto.find();
        res.json(produtos);
      } catch (err) {
        next(err);
      }
    })
    .post(async (req, res, next) => {
      try {
        const novoProduto = new Produto(req.body);
        await novoProduto.save();
        res.json(novoProduto);
      } catch (err) {
        next(err);
      }
    });

  // Rota para manipular um produto específico por ID
  router
    .route("/:id")
    .get(async (req, res, next) => {
      try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
          res.status(404).send("Produto não encontrado");
          return;
        }
        res.json(produto);
      } catch (err) {
        next(err);
      }
    })
    .put(async (req, res, next) => {
      try {
        const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        if (!produto) {
          res.status(404).send("Produto não encontrado");
          return;
        }
        res.json(produto);
      } catch (err) {
        next(err);
      }
    })
    .delete(async (req, res, next) => {
      try {
        const produto = await Produto.findByIdAndDelete(req.params.id);
        if (!produto) {
          res.status(404).send("Produto não encontrado");
          return;
        }
        res.json({ message: "Produto deletado com sucesso" });
      } catch (err) {
        next(err);
      }
    });

  // Rota para fazer upload da imagem de um produto específico
  router
    .route("/:id/imagem")
    .post(async (req, res, next) => {
      try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
          res.status(404).send("Produto não encontrado");
          return;
        }

        // Salva a string base64 da imagem no campo `imagemBase64` do produto
        produto.imagemBase64 = req.body.imagemBase64;
        await produto.save();
        res.json(produto);
      } catch (err) {
        next(err);
      }
    });

  return router;
};

module.exports = produtoRouter;
