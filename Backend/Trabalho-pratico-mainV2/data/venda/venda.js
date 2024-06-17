const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProdutoNoCarrinhoSchema = new Schema({
    produto: { type: Schema.Types.ObjectId, ref: 'Produto', required: true },
    quantidade: { type: Number, required: true }
});

const VendaSchema = new Schema({
    nrVenda: { type: Number, required: true, unique: true },
    cliente: { type: String, required: true },
    produtos: [ProdutoNoCarrinhoSchema],
    total: { type: Number, required: true },
    estado: { type: String, required: true, enum: ["Carrinho", "Pago"], default: "Carrinho" },
});

const Venda = mongoose.model("Venda", VendaSchema);

module.exports = Venda;
