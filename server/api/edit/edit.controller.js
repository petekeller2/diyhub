'use strict';

var _ = require('lodash');
var Edit = require('./edit.model');

// Get list of edits
exports.index = function(req, res) {
  Edit.find(function (err, edits) {
    if(err) { return handleError(res, err); }
    return res.json(200, edits);
  });
};

// Get a single edit
exports.show = function(req, res) {
  Edit.findById(req.params.id, function (err, edit) {
    if(err) { return handleError(res, err); }
    if(!edit) { return res.send(404); }
    return res.json(edit);
  });
};

// Creates a new edit in the DB.
exports.create = function(req, res) {
  Edit.create(req.body, function(err, edit) {
    if(err) { return handleError(res, err); }
    return res.json(201, edit);
  });
};

// Updates an existing edit in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Edit.findById(req.params.id, function (err, edit) {
    if (err) { return handleError(res, err); }
    if(!edit) { return res.send(404); }
    var updated = _.merge(edit, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, edit);
    });
  });
};

// Deletes a edit from the DB.
exports.destroy = function(req, res) {
  Edit.findById(req.params.id, function (err, edit) {
    if(err) { return handleError(res, err); }
    if(!edit) { return res.send(404); }
    edit.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}