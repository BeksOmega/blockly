/**
 * @fileoverview Classes for all types of piece events.
 * @author bekawestberg@gmail.com (Beka Westberg)
 */

'use strict';

goog.provide('Blockly.Events.PieceDelete');

goog.require('Blockly.Events');
goog.require('Blockly.Events.Abstract');


/**
 * Class for a piece delete event.
 * @param {!string} pieceName The name of the deleted piece.
 * @param {!Blockly.Block} sourceBlock The block the context menu
 *    is attached to.
 */
Blockly.Events.PieceDelete = function(pieceName, sourceBlock) {
  Blockly.Events.PieceDelete.superClass_.constructor.call(this);
  this.pieceName = pieceName;
  this.propertyArray = Blockly.Pieces.piecesDB_[pieceName];
  this.workspaceId = sourceBlock.workspace.targetWorkspace ?
      sourceBlock.workspace.targetWorkspace.id : sourceBlock.workspace.id;
};
goog.inherits(Blockly.Events.PieceDelete, Blockly.Events.Abstract);

/**
 * Encode the event as JSON
 * @return {!Object} JSON representation.
 */
Blockly.Events.PieceDelete.prototype.toJson = function() {
  var json = Blockly.Events.PieceDelete.superClass_.toJson.call(this);
  json["pieceName"] = this.pieceName;
  json["propertyArray"] = this.propertyArray;
  return json;
};

/**
 * Decode the JSON event.
 * @param {!Object} json JSON representation.
 */
Blockly.Events.PieceDelete.prototype.fromJson = function(json) {
  Blockly.Events.PieceDelete.superClass_.fromJson.call(this, json);
  this.pieceName = json["pieceName"];
  this.propertyArray = json["propertyArray"];
};

/**
 * The type of this event.
 * @type {string}
 */
Blockly.Events.PieceDelete.prototype.type = 'piece_delete';

/**
 * Run a delete event.
 * @param {boolean} forward True if run forward, false if run backward (undo).
 */
Blockly.Events.PieceDelete.prototype.run = function(forward) {
  if (forward) {
    delete Blockly.Pieces.piecesDB_[this.pieceName];
  } else {
    Blockly.Pieces.piecesDB_[this.pieceName] = this.propertyArray;
    Blockly.Workspace.getById(this.workspaceId).refreshToolboxSelection();
  }
};
