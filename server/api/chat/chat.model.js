'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatSchema = new Schema({
  message: String,
  username: String,
  active: Boolean
});

module.exports = mongoose.model('Chat', ChatSchema);