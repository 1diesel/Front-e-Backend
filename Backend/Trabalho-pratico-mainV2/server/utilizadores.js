const express = require("express");
const bodyParser = require("body-parser");
const Utilizador = require("../data/utilizador/utilizador");
const utilizadorCreate = require("../data/utilizador/utilizadorService");
const utilizadorService = utilizadorCreate(Utilizador);

const utilizadorRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json({ limit: "100mb" }));
    router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

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

    router.route("/")
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

    // Rota para atualizar um usuário
    router.put("/:id", async (req, res, next) => {
        try {
            const userId = req.params.id;
            const userData = req.body;

            // Verificar se o usuário autenticado é o mesmo que está tentando atualizar
            if (req.user.id !== userId) {
                return res.status(403).json({ message: "Forbidden: You are not allowed to update this user." });
            }

            // Atualizar o usuário
            const updatedUser = await Utilizador.findByIdAndUpdate(userId, userData, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    });

    return router;
};

module.exports = utilizadorRouter;
