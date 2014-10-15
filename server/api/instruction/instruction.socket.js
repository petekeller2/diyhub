/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Instruction = require('./instruction.model');

exports.register = function(socket) {
  Instruction.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Instruction.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('instruction:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('instruction:remove', doc);
}