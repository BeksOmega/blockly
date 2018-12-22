/**
 * @fileoverview Classes for all types of piece events.
 * @author bekawestberg@gmail.com (Beka Westberg)
 */

'use strict';

goog.provide('Blockly.Events.PieceDelete');
goog.provide('Blockly.Events.PieceToolbox');

goog.require('Blockly.Events');
goog.require('Blockly.Events.Abstract');


/**
 * Class for a piece delete event.
 * @param {!string} pieceName The name of the deleted piece.
 * @param {!Object[]} propertyArray The array of property objects associated
 *    with this piece.
 * @param {!Blockly.Workspace} workspace The workspace/targetWorkspace of the
 *    block associated with the delete event.
 */
Blockly.Events.PieceDelete = function(pieceName, propertyArray, workspace) {
  Blockly.Events.PieceDelete.superClass_.constructor.call(this);
  this.pieceName = pieceName;
  this.propertyArray = propertyArray;
  this.workspaceId = workspace.id;
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
    Blockly.Pieces.refreshPieceAvailability_(
        Blockly.Workspace.getById(this.workspaceId));
  } else {
    Blockly.Pieces.piecesDB_[this.pieceName] = this.propertyArray;
  }
};

/**
 * Class for an event that handles adding/removing replacers/drawers from
 * their arrays so that when the toolbox refreshes it is correct.
 * @param {!Blockly.Workspace} workspace The workspace the toolbox belongs to.
 * @param {!string} pieceName The name of the piece the replacers/drawers
 *    are associated with.
 * @param {!boolean} hadReplacer Did the piece have a replacer on the
 *    workspace when it was deleted? Meaning there was an item for the given
 *    piece in the replacersArray_.
 * @param {!boolean} hadDrawer Did the piece have a drawer on the workspace
 *    when it was deleted? Meaning there was an item for the given piece in
 *    the drawersArray_.
 * @constructor
 */
Blockly.Events.PieceToolbox = function(workspace, pieceName,
    hadReplacer, hadDrawer) {
  Blockly.Events.PieceToolbox.superClass_.constructor.call(this);
  this.pieceName = pieceName;
  this.hadReplacer = hadReplacer;
  this.hadDrawer = hadDrawer;
  this.workspaceId = workspace.id;
};
goog.inherits(Blockly.Events.PieceToolbox, Blockly.Events.Abstract);

/**
 * Encode the event as JSON
 * @return {!Object} JSON representation.
 */
Blockly.Events.PieceToolbox.prototype.toJson = function() {
  var json = Blockly.Events.PieceDelete.superClass_.toJson.call(this);
  json['pieceName'] = this.pieceName;
  json['hadReplacer'] = this.hadReplacer;
  json['hadDrawer'] = this.hadDrawer;
  return json;
};

/**
 * Decode the JSON event.
 * @param {!Object} json JSON representation.
 */
Blockly.Events.PieceToolbox.prototype.fromJson = function(json) {
  Blockly.Events.PieceToolbox.superClass_.fromJson.call(this, json);
  this.pieceName = json['pieceName'];
  this.hadReplacer = json['hadReplacer'];
  this.hadDrawer = json['hadDrawer'];
};

/**
 * The type of this event.
 * @type {string}
 */
Blockly.Events.PieceToolbox.prototype.type = 'toolbox_refresh';

/**
 * Run a piece toolbox event.
 * @param {boolean} forward True if run forward, false if run backward (undo).
 */
Blockly.Events.PieceToolbox.prototype.run = function(forward) {
  if (forward) {
    // Forward means we act like we're deleting a piece, so the blocks need
    // to be removed from their arrays.
    var replacerIndex = Blockly.Pieces.replacersArray_.indexOf(this.pieceName);
    if (replacerIndex != -1) {
      Blockly.Pieces.replacersArray_.splice(replacerIndex, 1);
    }
    var drawerIndex = Blockly.Pieces.drawersArray_.indexOf(this.pieceName);
    if (drawerIndex != -1) {
      Blockly.Pieces.drawersArray_.splice(drawerIndex, 1);
    }
    // Refresh is handled by the PieceDelete event because it comes last.
  } else {
    // Not forward means we act like we're un-deleting a piece, so the
    // blocks need to be added to their arrays.
    if (this.hadReplacer) {
      Blockly.Pieces.replacersArray_.push(this.pieceName);
    }
    if (this.hadDrawer) {
      Blockly.Pieces.drawersArray_.push(this.pieceName);
    }
    // We handle refresh because we come last.
    Blockly.Pieces.refreshPieceAvailability_(
        Blockly.Workspace.getById(this.workspaceId));
  }
};
