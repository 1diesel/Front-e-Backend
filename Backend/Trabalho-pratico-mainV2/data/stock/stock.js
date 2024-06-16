const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StockSchema = new Schema({
    ref: { type: Number, required: true, unique: true },
    movimento: { type: String, required: true },
    quantidade: { type: Number, required: true },
    idProduto: { type: Schema.Types.ObjectId, ref: 'Produto', required: true },
    data: { type: Date, required: true },
    anotacoes: { type: String },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;