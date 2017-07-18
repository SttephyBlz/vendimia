const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var configurationSchema = new Schema({
    tasa_financiamiento: Number,
    porciento_enganche: Number,
    plazo_maximo: Number
});

module.exports = mongoose.model('Configuration', configurationSchema);
