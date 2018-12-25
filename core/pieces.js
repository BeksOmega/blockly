/**
 * @fileoverview Utility functions for handling pieces.
 * @author bekawestberg@gmail.com (Beka Westberg)
 */

'use strict';

goog.provide('Blockly.Pieces');

goog.require('Blockly.Events');
goog.require('Blockly.Events.PieceDelete');
goog.require('goog.dom');

Blockly.Pieces.NAME_TYPE = 'PIECES';

/**
 * A map of strings to arrays of objects with name and ID properties.
 * The strings are names of pieces. The array associated with each string
 * contains that piece's properties. The objects' name is the display name, and
 * the ID is used for comparison purposes in the mutator.
 * Property = Object{name, id}
 */
Blockly.Pieces.piecesDB_ = Object.create(null);
Blockly.Pieces.replacersArray_ = [];
Blockly.Pieces.drawersArray_ = [];

/**
 * Construct the elements (blocks and button) required by the flyout for the
 * pieces category.
 * @param {!Blockly.Workspace} workspace The workspace containing the pieces.
 * @return {!Array.<!Element>} Array of XML elements.
 */
Blockly.Pieces.flyoutCategory = function(workspace){
  var xmlList = [];
  var button = goog.dom.createDom('button');
  button.setAttribute('text', '%{BKY_NEW_PIECE}');
  button.setAttribute('callbackKey', 'CREATE_PIECE');

  workspace.registerButtonCallback('CREATE_PIECE', function(button){
    Blockly.Pieces.createPieceButtonHandler(button.getTargetWorkspace());
  });
  xmlList.push(button);

  var blockList = Blockly.Pieces.flyoutCategoryBlocks();
  xmlList = xmlList.concat(blockList);
  return xmlList;
};

/**
 * Construct the blocks required by the flyout for the pieces category. Only
 * constructs replace & draw pieces that are not in the workspace
 * (replacersArray & drawersArray).
 * @returns {!Array.<!Element>} Array of XML elements.
 */
Blockly.Pieces.flyoutCategoryBlocks = function(){
  var xmlList = [];
  var pieceNamesArray = Object.keys(Blockly.Pieces.piecesDB_);
  pieceNamesArray.sort();
  if (pieceNamesArray.length > 0){
    if (Blockly.Pieces.replacersArray_.length < pieceNamesArray.length) {
      xmlList.push(
          Blockly.Pieces.createBlockXml('piece_replace', pieceNamesArray[0]));
    }
    if (Blockly.Pieces.drawersArray_.length < pieceNamesArray.length) {
      xmlList.push(
          Blockly.Pieces.createBlockXml('piece_draw', pieceNamesArray[0]));
    }
    if (xmlList.length) {
      xmlList[xmlList.length - 1].setAttribute('gap', 24);
    }
    for (var i = 0, pieceName; pieceName = pieceNamesArray[i]; i++) {
      xmlList.push(Blockly.Pieces.createBlockXml('piece_object', pieceName));
    }
  }
  return xmlList;
};

/**
 * Create the XML for the flyout for the block of the specified type.
 * @param {!string} blockType The type to assign to the block's 'type'
 *    attribute e.g 'piece_object' or 'piece_replace'
 * @param {!string} pieceName The name to assign to the block's PIECE_NAME
 *    field.
 * @returns {!Element} XML for the block.
 */
Blockly.Pieces.createBlockXml = function(blockType, pieceName){
  if (Blockly.Blocks[blockType]){
    var block = goog.dom.createDom('block');
    block.setAttribute('type', blockType);
    block.setAttribute('gap', 8);

    if (blockType == 'piece_object') {
      var nameField = goog.dom.createDom('field', null, pieceName);
      nameField.setAttribute('name', 'PIECE_NAME');
      block.appendChild(nameField);
    }

    if (Blockly.Pieces.piecesDB_[pieceName].length){
      var container = document.createElement('mutation');
      container.setAttribute('name', pieceName);
      block.appendChild(container);
    }

    return block;
  }
};

/** Create the XML for the ContextMenu option for the given property.
 * @param {!string} propertyName The name of the property.
 * @param {!number} propertyId The Id of the property.
 * @param {!Blockly.Block} sourceBlock The source block the property/ContextMenu
 *    belongs to.
 * @returns {!Element} The XML for the block.
 */
Blockly.Pieces.createPropertyBlockXml =
    function(propertyName, propertyId, sourceBlock){
      if (Blockly.Blocks['piece_property']){
        var blockXml = goog.dom.createDom('block');
        blockXml.setAttribute('type', 'piece_property');

        var nameField = goog.dom.createDom('field', null, propertyName);
        nameField.setAttribute('name', 'NAME');
        blockXml.appendChild(nameField);

        var dataField = goog.dom.createDom('data', null,
            sourceBlock.getFieldValue('PIECE_NAME') + "," + propertyId);
        blockXml.appendChild(dataField);

        return blockXml;
      }
    };

/**
 * Handles "Create Piece" button in the pieces toolbox category.
 * It will prompt the user for a piece name, including re-prompts if a name
 * is already in use among the workspace's pieces.
 * @param {!Block.Workspace} workspace The workspace on which to create the
 * piece.
 */
Blockly.Pieces.createPieceButtonHandler = function(workspace){
  var promptAndCheckWithAlert = function(defaultName) {
    Blockly.Variables.promptName(
        Blockly.Msg['NEW_PIECE_TITLE'],
        defaultName,
        function(text) {
          if (text) {
            var existing = !!Blockly.Pieces.piecesDB_[text];
            if (existing) {
              var lowerCase = text.toLowerCase();
              var msg = Blockly.Msg['PIECE_ALREADY_EXISTS']
                  .replace('%1', lowerCase);
              Blockly.alert(msg,
                  function() {
                    promptAndCheckWithAlert(text); // Recurse
                  });
            } else {
              // No conflict
              Blockly.Pieces.piecesDB_[text] = [];
              Blockly.Pieces.updateDisabled_(workspace, 'piece_replace', false);
              Blockly.Pieces.updateDisabled_(workspace, 'piece_draw', false);
            }
          }
        }
    );
  };

  promptAndCheckWithAlert('');
  workspace.refreshToolboxSelection();
};

/**
 * Prompt the user for a new piece name.
 * @param {string} promptText The string of the prompt.
 * @param {string} defaultText The default value to show in the prompt's field.
 * @param {function(?string)} callback A callback. It will return the new
 *     variable name, or null if the user picked something illegal.
 */
Blockly.Pieces.promptName = function(promptText, defaultText, callback) {
  Blockly.prompt(promptText, defaultText, function(newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    // Beyond this, all names are legal.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    }
    callback(newVar);
  });
};

/**
 * Listen for changes so we can update A) the replacersArray & drawersArray
 * whenever a replacer/drawer is created/deleted, and B) update the blocks'
 * warnings if they are the child of an incorrect root block.
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.changeSubscriber = function(event){
  if (event.type == Blockly.Events.BLOCK_CREATE) {
    Blockly.Pieces.onBlockCreate(event);
  } else if (event.type == Blockly.Events.BLOCK_DELETE){
    Blockly.Pieces.onBlockDelete(event);
  } else if (event.type == Blockly.Events.BLOCK_MOVE) {
    Blockly.Pieces.onBlockMove(event);
  } else if (event.type == Blockly.Events.BLOCK_CHANGE) {
    Blockly.Pieces.onBlockChange(event);
  }
};

/**
 * Add replacer/drawer blocks to the replacer/drawer arrays when they are
 * created.  Also update their dropdowns (disabled/enabled).
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockCreate = function(event) {
  var workspace = Blockly.Workspace.getById(event.workspaceId);
  var block = workspace.getBlockById(event.blockId);

  if (block){
    if (block.type == 'piece_replace'){
      var name = block.getFieldValue('PIECE_NAME');
      if (Blockly.Pieces.replacersArray_.indexOf(name) == -1) {
        Blockly.Pieces.replacersArray_.push(name);
        workspace.refreshToolboxSelection();
        Blockly.Pieces.updateDisabled_(workspace, 'piece_replace',
            Blockly.Pieces.replacersArray_.length ==
            Object.keys(Blockly.Pieces.piecesDB_).length);
        block.updateShape_();
      }
    } else if (block.type == 'piece_draw') {
      var name = block.getFieldValue('PIECE_NAME');
      if (Blockly.Pieces.drawersArray_.indexOf(name) == -1) {
        Blockly.Pieces.drawersArray_.push(name);
        workspace.refreshToolboxSelection();
        Blockly.Pieces.updateDisabled_(workspace, 'piece_draw',
            Blockly.Pieces.drawersArray_.length ==
            Object.keys(Blockly.Pieces.piecesDB_).length);
        block.updateShape_();
      }
    }
  }
};

/**
 * Remove replacer/drawer blocks from the replacer/drawer arrays when they are
 * deleted. Also update their dropdowns (disabled/enabled).
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockDelete = function(event) {
  var workspace = Blockly.Workspace.getById(event.workspaceId);
  var type = event.oldXml.getAttribute('type');
  if (type){
    if (type == 'piece_replace'){
      // NodeValue is PIECE_NAME
      var index = Blockly.Pieces.replacersArray_.indexOf(
          event.oldXml.firstChild.firstChild.nodeValue);
      if (index != -1) {
        Blockly.Pieces.replacersArray_.splice(index, 1);
        workspace.refreshToolboxSelection();
        Blockly.Pieces.updateDisabled_(
            Blockly.Workspace.getById(event.workspaceId),
            'piece_replace',
            Blockly.Pieces.replacersArray_.length ==
            Object.keys(Blockly.Pieces.piecesDB_).length);
      }
    } else if (type == 'piece_draw') {
      // NodeValue is PIECE_NAME
      var index = Blockly.Pieces.drawersArray_.indexOf(
          event.oldXml.firstChild.firstChild.nodeValue);
      if (index != -1) {
        Blockly.Pieces.drawersArray_.splice(index, 1);
        workspace.refreshToolboxSelection();
        Blockly.Pieces.updateDisabled_(
            Blockly.Workspace.getById(event.workspaceId),
            'piece_draw',
            Blockly.Pieces.drawersArray_.length ==
            Object.keys(Blockly.Pieces.piecesDB_).length);
      }
    }
  }
};

/**
 * Have the blocks that moved (including child blocks) update their warnings
 * and disabled state when they move. The blocks check if they have a new
 * parent and if so, if that parent is valid for them.
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockMove = function(event) {
  var block = Blockly.Workspace.getById(event.workspaceId)
      .getBlockById(event.blockId);
  if (!block) {
    return;
  }
  var childBlocks = block.getDescendants();
  for (var i = 0, childBlock; childBlock = childBlocks[i]; i++) {
    if (childBlock.checkValid) {
      childBlock.checkValid();
    }
  }
};

/**
 * Update the replacer/drawer arrays when the dropdowns change.
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockChange = function(event) {
  if (event.element != 'field') {
    return;
  }
  var workspace = Blockly.Workspace.getById(event.workspaceId);
  var block = workspace.getBlockById(event.blockId);
  // No need to call updateDisabled because we are not adding anymore options,
  // Just switching an option.
  var update = false;
  if (block.type == 'piece_replace') {
    var index = Blockly.Pieces.replacersArray_.indexOf(event.oldValue);
    if (index != -1) {
      Blockly.Pieces.replacersArray_.splice(index, 1);
    }
    Blockly.Pieces.replacersArray_.push(event.newValue);
    update = true;
  } else if (block.type == 'piece_draw') {
    var index = Blockly.Pieces.drawersArray_.indexOf(event.oldValue);
    if (index != -1) {
      Blockly.Pieces.drawersArray_.splice(index, 1);
    }
    Blockly.Pieces.drawersArray_.push(event.newValue);
    update = true;
  }

  if (update) {
    workspace.refreshToolboxSelection();
    block.updateShape_();
    var propertyBlocks = workspace.getBlocksByType('piece_property');
    for (var i = 0, property; property = propertyBlocks[i]; i++) {
      property.checkValid();
    }
  }
};

/**
 * Update the enabled/disabled state forthe dropdowns of all of the blocks
 * of the specified type on the given workspace.
 * @param {!Blockly.Workspace} workspace The workspace the blocks we are
 *    updating belong to.
 * @param {string} blockType The type of block that we are updating.
 * @param {boolean} disabled The state to set the blocks' dropdowns to.
 * @private
 */
Blockly.Pieces.updateDisabled_ = function(workspace, blockType, disabled) {
  var blocksToUpdate = workspace.getBlocksByType(blockType);
  for (var i = 0, block; block = blocksToUpdate[i]; i++) {
    block.updateDropdown(disabled);
  }
};

/**
 * Create a ContextMenu option for creating a replacer block.
 * @param {!string} pieceName The name of the piece the replacer is associated
 *    with.
 * @param {!Blockly.Block} sourceBlock The block that the ContextMenu is
 *    attached to.
 * @returns {!Object} A menu option, containing text, enabled, and a callback.
 */
Blockly.Pieces.createReplacerOption = function(pieceName, sourceBlock) {
  var replacerOption = {enabled: true};
  replacerOption.text = Blockly.Msg['PIECE_REPLACE_OPTION']
      .replace('%1', pieceName);
  var blockXml = Blockly.Pieces.createBlockXml('piece_replace', pieceName);
  replacerOption.callback = Blockly.ContextMenu.callbackFactory(sourceBlock,
      blockXml);
  return replacerOption;
};

/**
 * Create a ContextMenu option for creating a drawer block.
 * @param {!string} pieceName The name of the piece the drawer is associated
 *    with.
 * @param {!Blockly.Block} sourceBlock The block that the ContextMenu is
 *    attached to.
 * @returns {!Object} A menu option, containing text, enabled, and a callback.
 */
Blockly.Pieces.createDrawerOption = function(pieceName, sourceBlock) {
  var drawerOption = {enabled: true};
  drawerOption.text = Blockly.Msg['PIECE_DRAW_OPTION']
      .replace('%1', pieceName);
  var blockXml = Blockly.Pieces.createBlockXml('piece_draw', pieceName);
  drawerOption.callback = Blockly.ContextMenu.callbackFactory(sourceBlock,
      blockXml);
  return drawerOption;
};

/**
 * Create a ContextMenu option for creating a 'create piece' block.
 * @param {!string} pieceName The name of the piece the 'create piece' block is
 *    associated with.
 * @param {!Blockly.Block} sourceBlock The block that the ContextMenu is
 *    attached to.
 * @returns {!Object} A menu option, containing text, enabled, and a callback.
 */
Blockly.Pieces.createCreatePieceOption = function(pieceName, sourceBlock) {
  var createPieceOption = {enabled: true};
  createPieceOption.text = Blockly.Msg['PIECE_CREATE_PIECE_OPTION']
      .replace('%1', pieceName);
  var blockXml = Blockly.Pieces.createBlockXml('piece_object', pieceName);
  createPieceOption.callback = Blockly.ContextMenu.callbackFactory(sourceBlock,
      blockXml);
  return createPieceOption;
};

/**
 * Create a ContextMenu option for creating a property block.
 * @param {!Object} property A property object containing a name, and an id
 *    unique among all other properties of the block.
 * @param {!Blockly.Block} sourceBlock The block that the ContextMenu is
 *    attached to.
 * @returns {!Object} A menu option, containing text, enabled, and a callback.
 */
Blockly.Pieces.createGetPropertyOption = function(property, sourceBlock) {
  var getPropertyOption = {enabled: true};
  getPropertyOption.text = Blockly.Msg['PIECE_PROPERTY_OPTION']
      .replace('%1', property.name);
  var blockXml = Blockly.Pieces.createPropertyBlockXml(property.name,
      property.id, sourceBlock);
  getPropertyOption.callback = Blockly.ContextMenu.callbackFactory(sourceBlock,
      blockXml);
  return getPropertyOption;
};

/**
 * Create a ContextMenu option for deleting a piece.
 * @param {!string} pieceName The name of the piece to delete.
 * @param {!Blockly.Block} sourceBlock The block that the ContextMenu is
 *    attached to.
 * @returns {!Object} A menu option, containing text, enabled, and a callback.
 */
Blockly.Pieces.createDeletePieceOption = function(pieceName, sourceBlock){
  var deletePieceOption = {enabled: true};
  deletePieceOption.text = Blockly.Msg['PIECE_DELETE_OPTION']
      .replace('%1', pieceName);
  
  deletePieceOption.callback = function() {
    var workspace = sourceBlock.workspace.targetWorkspace ||
      sourceBlock.workspace;

    Blockly.Events.setGroup(true);
    // We need to grab the properties of the piece before we delete this
    // data so that it can be used when we create the PieceDelete event.
    var propertyArray = Blockly.Pieces.piecesDB_[pieceName];
    var replacerIndex = Blockly.Pieces.replacersArray_.indexOf(pieceName);
    var drawerIndex = Blockly.Pieces.drawersArray_.indexOf(pieceName);
    Blockly.Events.fire(new Blockly.Events.PieceToolbox(workspace, pieceName,
        replacerIndex != -1, drawerIndex != -1));

    delete Blockly.Pieces.piecesDB_[pieceName];
    if (replacerIndex != -1) {
      Blockly.Pieces.replacersArray_.splice(replacerIndex, 1);
      var replacers = workspace.getBlocksByType('piece_replace');
      for (var i = 0, replacer; replacer = replacers[i]; i++) {
        if (replacer.getFieldValue('PIECE_NAME') == pieceName) {
          replacer.dispose();
          // There should only be one replacer with the given piece name so no
          // need to loop through the rest.
          break;
        }
      }
    }
    if (drawerIndex != -1) {
      Blockly.Pieces.drawersArray_.splice(drawerIndex, 1);
      var drawers = workspace.getBlocksByType('piece_draw');
      for (var i = 0, drawer; drawer = drawers[i]; i++) {
        if (drawer.getFieldValue('PIECE_NAME') == pieceName) {
          drawer.dispose();
          break;
        }
      }
    }
    var pieceObjects = workspace.getBlocksByType('piece_object');
    for (var i = 0, pieceObject; pieceObject = pieceObjects[i]; i++) {
      if (pieceObject.getFieldValue('PIECE_NAME') == pieceName) {
        pieceObject.dispose(true);
      }
    }
    var pieceProperties = workspace.getBlocksByType('piece_property');
    for (var i = 0, pieceProperty; pieceProperty = pieceProperties[i]; i++) {
      if (pieceProperty.data.split(",")[0] == pieceName) {
        pieceProperty.dispose();
      }
    }

    Blockly.Pieces.refreshPieceAvailability_(workspace);
    Blockly.Events.fire(
        new Blockly.Events.PieceDelete(pieceName, propertyArray, workspace));
    Blockly.Events.setGroup(false);
  };

  return deletePieceOption;
};

/**
 * Updates the toolbox & the replacer/drawer dropdowns for the latest piece
 * info, i.e. when adding a piece or deleting a piece.
 * @param {!Blockly.Workspace} workspace The workspace that toolbox &
 *    replacers/drawers belong to.
 * @private
 */
Blockly.Pieces.refreshPieceAvailability_ = function(workspace) {
  workspace.refreshToolboxSelection();
  Blockly.Pieces.updateDisabled_(workspace, 'piece_replace',
      Blockly.Pieces.replacersArray_.length ==
      Object.keys(Blockly.Pieces.piecesDB_).length);
  Blockly.Pieces.updateDisabled_(workspace, 'piece_draw',
      Blockly.Pieces.drawersArray_.length ==
      Object.keys(Blockly.Pieces.piecesDB_).length);
};
