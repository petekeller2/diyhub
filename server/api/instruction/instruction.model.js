'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InstructionSchema = new Schema({
  title: String,
  content: String,
  author: String,
  editors: String,
  pendingEditCount: Number
});

module.exports = mongoose.model('Instruction', InstructionSchema);