const express = require("express");
const bodyParser = require("body-parser");
const Utilizador = require("../data/utilizador/utilizador");

const utilizadorRouter = () => {
  let router = express.Router();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(async (req, res, next) => {
    const token = req.headers["x-access-token"]; // Obtém o token do cabeçalho da requisição
    if (!token) {
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." }); // Retorna erro de não autorizado se o token não for fornecido
    }
    try {
      const decoded = await Utilizador.verifyToken(token); // Verifica o token com a função verifyToken do Utilizador
      req.user = decoded; // Armazena as informações do utilizador decodificado no objeto de requisição
      next(); // Passa para o próximo middleware
    } catch (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." }); // Retorna erro interno do servidor se houver falha na autenticação do token
    }
  });

  router
    .route("/")
    .get(async (req, res, next) => {
      try {
        const utilizadores = await Utilizador.find();
        res.json(utilizadores);
      } catch (err) {
        next(err);
      }
    })
    .post(async (req, res, next) => {
      try {
        const utilizador = await Utilizador.create(req.body);
        res.status(201).json(utilizador);
      } catch (err) {
        next(err);
      }
    });

  return router;
};

module.exports = utilizadorRouter;
