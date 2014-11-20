'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  commentContent: String,
  commenter: String,
  link: String
});

module.exports = mongoose.model('Comment', CommentSchema);