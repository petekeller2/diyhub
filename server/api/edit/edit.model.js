'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EditSchema = new Schema({
  editedContent: String,
  editor: String,
  link: String
});

module.exports = mongoose.model('Edit', EditSchema);