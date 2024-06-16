const bodyParser = require("body-parser");
const express = require("express");
const Utilizador = require("../data/utilizador/utilizador"); // Import the Utilizador model
const utilizadorCreate = require("../data/utilizador/utilizadorService"); // Import utilizadorService
const utilizadorService = utilizadorCreate(Utilizador); // Pass Utilizador model to utilizadorCreate

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/me").get(function (req, res, next) {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }
    return Utilizador.verifyToken(token)
      .then((decoded) => {
        console.log(decoded);
        res.status(202).send({ auth: true, decoded });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
        next(err);
      });
  });

  router.route("/registar").post(function (req, res, next) {
    const body = req.body;
    console.log("Utilizador:", body);
    utilizadorService
      .create(body) // Call the create function from utilizadorService
      .then(() => {
        // Assuming create function resolves with the created user object
        return utilizadorService.createToken(body); // Use service.createToken
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error("Erro ao registrar usuário:", err);
        res
          .status(500)
          .send({ auth: false, message: "Failed to register user." });
        next(err);
      });
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;
    console.log("Login para o Utilizador: ", body);
    utilizadorService
      .findUtilizador(body)
      .then((utilizador) => {
        if (!utilizador) {
          return res
            .status(404)
            .send({ auth: false, message: "User not found." });
        }
        return utilizadorService.createToken(utilizador);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate user." });
        next(err);
      });
  });

  return router;
}

module.exports = AuthRouter;
