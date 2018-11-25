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

Blockly.Pieces.piecesDB_ = {};
Blockly.Pieces.replacersArray = [];
Blockly.Pieces.drawersArray = [];

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

  var blockList = Blockly.Pieces.flyoutCategoryBlocks(workspace);
  xmlList = xmlList.concat(blockList);
  return xmlList;
}

/** 
 * Construct the blocks required by the flyout for the pieces category. Only
 * constructs replace & draw pieces that are not in the workspace
 * (replacersArray & drawersArray).
 * @param {!Blockly.Workspace} workspace The workspace containing the pieces.
 * @param {!Array.<!Element>} Array of XML elements.
 */
Blockly.Pieces.flyoutCategoryBlocks = function(workspace){
	var xmlList = [];
	var pieceNamesArray = [];
	for (var key in Blockly.Pieces.piecesDB_){
		if (Blockly.Pieces.piecesDB_.hasOwnProperty(key)){
			pieceNamesArray.push(key);
		}
	}
	pieceNamesArray.sort()
	if(pieceNamesArray.length > 0){
		for (var i = 0, pieceName; pieceName = pieceNamesArray[i]; i++) {
      xmlList.push(Blockly.Pieces.createBlockXml('piece_object', pieceName));
      if (!Blockly.Pieces.replacersArray.includes(pieceName)){
        xmlList.push(Blockly.Pieces
            .createBlockXml('piece_replace', pieceName));
      }
      if (!Blockly.Pieces.drawersArray.includes(pieceName)){
        xmlList.push(Blockly.Pieces.createBlockXml('piece_draw', pieceName));
      }
      xmlList[xmlList.length -1].setAttribute('gap', 32);
		}
	}
	return xmlList;
}

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
    block.setAttribute('gap', 16);

    var nameField = goog.dom.createDom('field', null, pieceName);
    nameField.setAttribute('name', 'PIECE_NAME');
    block.appendChild(nameField);

    if (Blockly.Pieces.piecesDB_[pieceName].length > 0){
      var container = document.createElement('mutation');
      container.setAttribute('name', pieceName);
      block.appendChild(container);
    }

    return block;
  }
}

/** Create the XML for the ContextMenu option for the given property.
 * @param {!string} propertyName The name of the property.
 * @param {!number} propertyId The Id of the property.
 * @param {!Blockly.Block} sourceBlock The source block the property/ContextMenu
 *    belongs to.
 * @returns {!Element} The XML for the block.
 */
Blockly.Pieces.createPropertyBlockXml = 
    function(propertyName, propertyId, sourceBlock){
  if(Blockly.Blocks['piece_property']){
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
}

/**
 * Handles "Create Piece" button in the pieces toolbox category.
 * It will prompt the user for a piece name, including re-prompts if a name
 * is already in use among the workspace's pieces.
 * @param {!Block.Workspace} workspace The workspace on which to create the
 * piece.
 */
Blockly.Pieces.createPieceButtonHandler = function(workspace){
	var promptAndCheckWithAlert = function(defaultName) {
		Blockly.Variables.promptName(Blockly.Msg['NEW_PIECE_TITLE'], defaultName,
		function(text) {
			if (text) {
				var existing = Blockly.Pieces.piecesDB_.hasOwnProperty(text);
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
				}
			}
		});
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
  }
};

/**
 * Add replacer/drawer blocks to the replacer/drawer arrays when they are
 * created.
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockCreate = function(event) {
  var block = Blockly.Workspace.getById(event.workspaceId)
      .getBlockById(event.blockId);

  if (block){
    if (block.type == 'piece_replace'){
      Blockly.Pieces.replacersArray.push(block.getFieldValue('PIECE_NAME'));
    } else if (block.type == 'piece_draw') {
      Blockly.Pieces.drawersArray.push(block.getFieldValue('PIECE_NAME'));
    }
  }
};

/**
 * Remove replacer/drawer blocks from the replacer/drawer arrays when they are
 * deleted.
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockDelete = function(event) {
  var type = event.oldXml.getAttribute('type');
  if (type){
    if (type == 'piece_replace'){
      var index = Blockly.Pieces.replacersArray.indexOf(
          event.oldXml.childNodes[1].nodeValue); //node value is PIECE_NAME
      Blockly.Pieces.replacersArray.splice(index, 1);
    } else if (type == 'piece_draw') {
      var index = Blockly.Pieces.drawersArray.indexOf(
          event.oldXml.childNodes[1].nodeValue); //node value is PIECE_NAME
      Blockly.Pieces.drawersArray.splice(index, 1);
    }
  }
};

/**
 * Have the blocks that moved (including child blocks) update their warnings
 * and disabled state when they move. The blocks check if they have a new
 * parent and if so, if that parent is valid for them.
 * @param {!Blockly.Event} event The event we are responding to.
 */
Blockly.Pieces.onBlockMove = function (event) {
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
}

/**
 * Create a ContextMenu option for creating a replacer block.
 * @param {!string} pieceName The name of the piece the replacer is associated
 *    with.
 * @param {!Blockly.Block} sourceBlock The block that the ContextMenu is
 *    attached to.
 * @returns {!Object} A menu option, containing text, enabled, and a callback.
 */
Blockly.Pieces.createReplacerOption = function(pieceName, sourceBlock) {
  var replacerOption = {enabled: true}
  replacerOption.text = Blockly.Msg['PIECE_REPLACE_OPTION']
      .replace('%1', pieceName);
  var blockXml = Blockly.Pieces.createBlockXml('piece_replace', pieceName);
  replacerOption.callback = Blockly.ContextMenu.callbackFactory(sourceBlock,
      blockXml);
  return replacerOption;
}

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
}

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
}

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
      .replace('%1', property.pieceName);
  var blockXml = Blockly.Pieces.createPropertyBlockXml(property.pieceName,
      property.id, sourceBlock);
  getPropertyOption.callback = Blockly.ContextMenu.callbackFactory(sourceBlock,
      blockXml);
  return getPropertyOption;
}

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
    Blockly.Events.setGroup(true);
    // The event needs to be created before we delete the piece from the
    // database, so that it can save all of the property information for
    // undoing the event.
    var event = new Blockly.Events.PieceDelete(pieceName, sourceBlock);
    //Remove the piece from the database.
    delete Blockly.Pieces.piecesDB_[pieceName];

    var workspace = sourceBlock.workspace.targetWorkspace ||
        sourceBlock.workspace;
    var deleteReplacer = Blockly.Pieces.replacersArray.includes(pieceName);
    var deleteDrawer = Blockly.Pieces.drawersArray.includes(pieceName);
    var blocks = workspace.getAllBlocks();

    // Delete any blocks in the workspace.
    for (var i = 0, block; block = blocks[i]; i++){
      if (deleteReplacer && block.type == 'piece_replace' &&
          block.getFieldValue('PIECE_NAME') == pieceName){
        block.dispose();
      } else if (deleteDrawer && block.type == 'piece_draw' &&
          block.getFieldValue('PIECE_NAME') == pieceName){
        block.dispose();
      } else if (block.type == 'piece_object' &&
          block.getFieldValue('PIECE_NAME') == pieceName) {
        block.dispose();
      } else if (block.type == 'piece_property' &&
          block.data.split(",")[0] == pieceName){
        block.dispose();
      }
    }

    workspace.refreshToolboxSelection();
    Blockly.Events.fire(event);
    Blockly.Events.setGroup(false);
  };

  return deletePieceOption;
}