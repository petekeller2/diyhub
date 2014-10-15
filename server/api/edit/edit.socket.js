/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Edit = require('./edit.model');

exports.register = function(socket) {
  Edit.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Edit.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('edit:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('edit:remove', doc);
}