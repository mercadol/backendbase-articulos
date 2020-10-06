'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  title:String,
  content:String,
  date: {type:Date, default: Date.now},
  image:String
});

module.exports = mongoose.model('Article', ArticleSchema);
// crea articles --> guarda documentos de este tipo con esta estructura.
