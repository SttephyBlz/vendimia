const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connect("mongodb://localhost:27017/pv"));

var articleSchema = new Schema({
    articleId: {type: Number, default: 0, unique: true},
    descripcion: String,
    modelo: String,
    precio: Number,
    existencia: Number
});

articleSchema.plugin(autoIncrement.plugin, { model: 'Article', field: 'articleId' });

module.exports = mongoose.model('Article', articleSchema);
