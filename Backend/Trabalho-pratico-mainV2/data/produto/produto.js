const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
    ref: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: false },
    preco: { type: Number, required: true },
    categoria: { type: String, required: true },
    subcategoria: { type: String, required: false },
    quantidadeDisponivel: { type: Number, default: 0 },
    quantidadeMinima: { type: Number, required: true },
});

const Produto = mongoose.model("Produto", ProdutoSchema);

module.exports = Produto;
