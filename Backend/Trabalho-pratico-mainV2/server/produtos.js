// server/produtos.js

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Produto = require("../data/produto/produto");
const Utilizador = require("../data/utilizador/utilizador");
const utilizadorCreate = require("../data/utilizador/utilizadorService");
const utilizadorService = utilizadorCreate(Utilizador);
const { authorize } = utilizadorService;
const scopes = require("../data/utilizador/scopes");

const produtoRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json({ limit: "10mb" }));

    // Middleware de autenticação
    router.use(async (req, res, next) => {
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ auth: false, message: "No token provided." });
        }

        try {
            const decoded = await Utilizador.verifyToken(token.split(' ')[1]);
            req.user = await Utilizador.findById(decoded.id);
            next();
        } catch (err) {
            return res.status(500).json({ auth: false, message: "Failed to authenticate token." });
        }
    });

    // Rota para listar todos os produtos e adicionar um novo produto
    router.route("/")
        .get(async (req, res, next) => {
            try {
                const produtos = await Produto.find();
                res.json(produtos); // Certifique-se de que está retornando um array
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
    router.route("/:id")
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
        .put(authorize([scopes["manage-products"]]), async (req, res, next) => {
            try {
                const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    router.route("/:id/imagem")
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
