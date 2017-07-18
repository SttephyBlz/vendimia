const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connect("mongodb://localhost:27017/pv"));

var clientSchema = new Schema({
    clientId: {type: Number, default: 0, unique: true},
    nombre: String,
    apellido_paterno: String,
    apellido_materno: String,
    rfc: String
});

clientSchema.plugin(autoIncrement.plugin, { model: 'Client', field: 'clientId' });

module.exports = mongoose.model('Client', clientSchema);
