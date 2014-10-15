'use strict';

var _ = require('lodash');
var Instruction = require('./instruction.model');

// Get list of instructions
exports.index = function(req, res) {
  Instruction.find(function (err, instructions) {
    if(err) { return handleError(res, err); }
    return res.json(200, instructions);
  });
};

// Get a single instruction
exports.show = function(req, res) {
  Instruction.findById(req.params.id, function (err, instruction) {
    if(err) { return handleError(res, err); }
    if(!instruction) { return res.send(404); }
    return res.json(instruction);
  });
};

// Creates a new instruction in the DB.
exports.create = function(req, res) {
  Instruction.create(req.body, function(err, instruction) {
    if(err) { return handleError(res, err); }
    return res.json(201, instruction);
  });
};

// Updates an existing instruction in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Instruction.findById(req.params.id, function (err, instruction) {
    if (err) { return handleError(res, err); }
    if(!instruction) { return res.send(404); }
    var updated = _.merge(instruction, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, instruction);
    });
  });
};

// Deletes a instruction from the DB.
exports.destroy = function(req, res) {
  Instruction.findById(req.params.id, function (err, instruction) {
    if(err) { return handleError(res, err); }
    if(!instruction) { return res.send(404); }
    instruction.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}