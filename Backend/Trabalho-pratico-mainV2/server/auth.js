const bodyParser = require("body-parser");
const express = require("express");
const Utilizador = require("../data/utilizador/utilizador");
const utilizadorCreate = require("../data/utilizador/utilizadorService");
const utilizadorService = utilizadorCreate(Utilizador);
const scopes = require("../data/utilizador/scopes");

function AuthRouter() {
  let router = express.Router();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/me").get(function (req, res, next) {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(401).send({ auth: false, message: "No token provided." });
    }
    token = token.split(" ")[1]; // Extract token from Bearer string

    Utilizador.verifyToken(token)
      .then(async (decoded) => {
        const user = await Utilizador.findById(decoded.id);
        if (!user) {
          return res.status(404).send({ auth: false, message: "User not found." });
        }
        res.status(202).send({ auth: true, user }); // Return user data
      })
      .catch((err) => {
        res.status(500).send({ auth: false, message: "Failed to authenticate token." });
        next(err);
      });
  });

  router.route("/registar").post(function (req, res, next) {
    const body = req.body;
    console.log("Utilizador:", body);
    utilizadorService.create(body)
      .then(() => {
        return utilizadorService.createToken(body);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error("Erro ao registrar usuário:", err);
        res.status(500).send({ auth: false, message: "Failed to register user." });
        next(err);
      });
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;
    console.log("Login para o Utilizador: ", body);
    utilizadorService.findUtilizador(body)
      .then((utilizador) => {
        if (!utilizador) {
          return res.status(404).send({ auth: false, message: "User not found." });
        }
        const tokenResponse = utilizadorService.createToken(utilizador);
        res.status(200).send({ ...tokenResponse, user: utilizador }); // Return token and user info
      })
      .catch((err) => {
        res.status(500).send({ auth: false, message: "Failed to authenticate user." });
        next(err);
      });
  });

  // Rota para registrar um administrador com escopo "manage-products"
  router.route("/registar-admin").post(function (req, res, next) {
    const body = req.body;
    console.log("Admin Utilizador:", body);
    // Definir o papel e escopo do administrador
    const adminRole = {
      name: "admin",
      scopes: [scopes["manage-products"]]
    };
    const adminBody = { ...body, role: adminRole };
    utilizadorService.create(adminBody)
      .then(() => {
        return utilizadorService.createToken(adminBody);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error("Erro ao registrar administrador:", err);
        res.status(500).send({ auth: false, message: "Failed to register admin." });
        next(err);
      });
  });

  return router;
}

module.exports = AuthRouter;
