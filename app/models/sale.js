const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connect("mongodb://localhost:27017/pv"));

var saleSchema = new Schema({
    saleId: {type: Number, default: 0, unique: true},
    client_id: Number,
    total: Number,
    abono: Number,
    plazo: Number,
    fecha: String
});

saleSchema.plugin(autoIncrement.plugin, { model: 'Sale', field: 'saleId' });

module.exports = mongoose.model('Sale', saleSchema);
