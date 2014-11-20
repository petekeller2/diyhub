'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  content: String,
  numberOfComments: Number,
  author: String
});

module.exports = mongoose.model('Article', ArticleSchema);