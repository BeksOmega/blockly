'use strict';

goog.require('Blockly.Blocks');

Blockly.Blocks['piece_object'] = {
  init: function() {
    var nameLabel = new Blockly.FieldLabel("pieceObject");
    nameLabel.EDITABLE = true; // We want this to save to xml.
    this.appendDummyInput('DUMMY_INPUT')
        .appendField(Blockly.Msg['PIECE_OBJECT_CREATE_MSG'])
        .appendField(nameLabel, 'PIECE_NAME');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_PIECES_HUE}');
    this.setMutator(new Blockly.Mutator(['piece_mutator_property']));
	this.setTooltip(Blockly.Msg['PIECE_OBJECT_TOOLTIP']);
	this.setHelpUrl("");
  },

  /**
   * Saves the piece name to the mutator node.
   * @returns {HTMLElement} The mutator element.
   */
  mutationToDom: function(){
    if (!this.name){
      this.name = this.getFieldValue('PIECE_NAME');
    }
		
		var container = document.createElement('mutation');
    container.setAttribute('name', this.name);
		return container;
	},

  /**
   * Restores block from xml, gives the block the name of the piece.
   * @param {!Element} xmlElement The mutator element that stores
   * information about the block.
   */
	domToMutation: function(xmlElement){
    this.name = xmlElement.getAttribute('name');
		this.updateShape_();
	},

  /**
   * Decomposes the block into its component quark-blocks (the blocks shown in
   * in the mutator) Also calls notifyOthers();
   * @param {!Blockly.Workspace} workspace The workspace of the mutator and
   * quark blocks.
   * @returns {!Blockly.BlockSvg} The top block to go inside the mutator
   * workspace.
   */
  decompose: function(workspace) {
    // Create Container
    var containerBlock = workspace.newBlock('piece_mutator_container');
    containerBlock.initSvg();

    // Create Property Blocks
    var connection = containerBlock.getInput('STACK').connection;
    if (Blockly.Pieces.piecesDB_[this.name]) {
      for (var i = 0; i < Blockly.Pieces.piecesDB_[this.name].length; i++){
        var propertyBlock = workspace.newBlock('piece_mutator_property');
        propertyBlock.initSvg();
        propertyBlock.setFieldValue(Blockly.Pieces
            .piecesDB_[this.name][i].name, 'NAME');
        propertyBlock.data = Blockly.Pieces.piecesDB_[this.name][i].id;
        connection.connect(propertyBlock.previousConnection);
        connection = propertyBlock.nextConnection;
      }
    }

    this.othersSaveConnections_();

    return containerBlock;
  },

  /**
   * Rebuilds the database for this block's piece, and makes sure that all
   * of the piece blocks (including itself) get updated.
   * @param {!Blockly.Block} containerBlock The top block in the mutator's
   * workspace.
   */
  compose: function(containerBlock){
    this.updateDatabase_(containerBlock);
    this.updateBlocks_();
  },

  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    /* Don't discard the connections, because if a block (representing a
       property) gets removed in the mutator saveConnections gets called *after*
       compose, which means we can't access the PROPERTY_INPUT associated with
       that block to "refresh" it. So we'll just overwrite any properties we
       can, and keep old ones around that we can't. */
    if (!this.inputConnections) {
      this.inputConnections = Object.create(null);
    }
    var i = 0;
    var input = this.getInput('PROPERTY_INPUT' + i);
    while (input) {
      // Map of the ID of the property associated with this input, to
      // whatever the input is connected to.
      this.inputConnections[Blockly.Pieces.piecesDB_[this.name][i].id] =
          input.connection.targetConnection;
      i++;
      input = this.getInput('PROPERTY_INPUT' + i);
    }
  },

  /**
   * Rebuilds the database for this block's piece.
   * @param {!Blockly.Block} containerBlock The top block in the mutator's
   * workspace.
   * @private
   */
  updateDatabase_: function(containerBlock) {
    // Figure out what the largest uniqueID is at the moment, and set uniqueID
    // to that.
    var uniqueID = 1;
    if (Blockly.Pieces.piecesDB_[this.name]) {
      for(var i = 0, propertyObject; propertyObject = Blockly.Pieces
        .piecesDB_[this.name][i]; i++) {
        if (uniqueID <= propertyObject.id) {
          uniqueID = parseInt(propertyObject.id, 10) + 1;
        }
      }
    }

    // Clear the database.
    Blockly.Pieces.piecesDB_[this.name] = [];

    // Save all of our property objects (name, ID) to the database.
    // Also collect up all of the input connections (while we're looping
    // through the blocks) so that we can reconnect them.
    var propertyBlock = containerBlock.getInputTargetBlock('STACK');
    while(propertyBlock){
      var object = {};
      object.name = propertyBlock.getFieldValue("NAME");
      if(propertyBlock.data){
        object.id = propertyBlock.data;
      } else {
        object.id = uniqueID.toString();
        propertyBlock.data = uniqueID.toString();
        uniqueID++;
      }
      Blockly.Pieces.piecesDB_[this.name].push(object);

      propertyBlock = propertyBlock.nextConnection &&
        propertyBlock.nextConnection.targetBlock();
    }
  },

  updateBlocks_: function() {
    // Update all of the other blocks associated with this piece.
    var blocks = this.workspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++){
      var type = blocks[i].type;
      if ((type == 'piece_object' ||
          type == 'piece_replace' ||
          type == 'piece_draw') &&
          blocks[i].getFieldValue('PIECE_NAME') == this.name){
        blocks[i].updateShape_();
      }
      if (type == 'piece_property'){
        var data = blocks[i].data.split(",");
        // If the property block is a property of this piece.
        if (data[0] == this.name){
          var name = null;
          // Loop through all of the properties of this piece, find the
          // property the block is associated with (if any)
          for(var j = 0, property; property = Blockly.Pieces
            .piecesDB_[this.name][j]; j++){
            if (data[1] == property.id){
              name = property.name;
              break;
            }
          }
          // If we found the property it is associated with (meaning it
          // wasn't deleted)
          if (name){
            blocks[i].setFieldValue(name, 'NAME');
            blocks[i].checkValid();
          } else {
            blocks[i].dispose(true);
          }
        }
        blocks[i].checkValid();
      }
    }
  },

  /**
   * Updates the shape of this block.
   * @private
   */
	updateShape_: function(){
    var i = 0;
    while(this.getInput('PROPERTY_INPUT' + i)) {
      this.removeInput('PROPERTY_INPUT' + i);
      i++;
    }

    if (Blockly.Pieces.piecesDB_[this.name]){
      for(var i = 0, property; property = Blockly.Pieces
          .piecesDB_[this.name][i]; i++){
        this.appendValueInput('PROPERTY_INPUT' + i)
          .setCheck(null)
          .appendField(property.name, 'PROPERTY_NAME' + i);

        //Reconnect input blocks to valueInput.
        if (this.inputConnections && this.inputConnections[property.id]) {
          Blockly.Mutator.reconnect(this.inputConnections[property.id], this,
              'PROPERTY_INPUT' + i);
        }
      }
    }
	},

  /**
   * calls saveConnections() on all other 'piece_object' blocks associated
   * with the same piece as this block. This makes sure that input blocks on
   * the other 'piece_object's don't get kicked when the mutator updates.
   * @private
   */
  othersSaveConnections_ : function() {
    var blocks = this.workspace.getAllBlocks();
    for (var i = 0, block; block = blocks[i]; i++) {
      if (blocks[i] == this) {
        continue;
      }
      if (block.type == 'piece_object' &&
        block.getFieldValue('PIECE_NAME') == this.name) {
        // We know it will have this function b/c it is the same type of
        // block as this block.
        block.saveConnections();
      }
    }
  },

  /**
   * Creates the custom context menu for this block.
   * @param options
   */
  customContextMenu: function(options){
    if (!this.isInFlyout) {
      if (!Blockly.Pieces.replacersArray.includes(this.name)) {
        options.push(Blockly.Pieces.createReplacerOption(this.name, this));
      }
      if (!Blockly.Pieces.drawersArray.includes(this.name)){
        options.push(Blockly.Pieces.createDrawerOption(this.name, this));
      }
    }
    options.push(Blockly.Pieces.createDeletePieceOption(this.name, this));
  },

  /**
   * Checks if this block is in a valid location (parent block). If not adds
   * a warning, if yes clears any warnings.
   */
  checkValid: function() {
    if (this.getRootBlock().type == 'piece_draw'){
      this.setWarningText(Blockly.Msg['PIECE_OBJECT_WARNING']);
      this.setDisabled(true);
    } else {
      this.setWarningText(null);
      this.setDisabled(false);
    }
  }
};

Blockly.Blocks['piece_replace'] = {
  init: function() {
    var nameLabel = new Blockly.FieldLabel("pieceObject");
    nameLabel.EDITABLE = true; // We want this to save to xml.
    this.appendDummyInput('DUMMY_INPUT')
        .appendField(Blockly.Msg['PIECE_REPLACE_REPLACE_MSG'])
        .appendField(nameLabel, 'PIECE_NAME');
    this.appendStatementInput("REPLACE")
        .setCheck(null)
        .appendField(Blockly.Msg['PIECE_REPLACE_WITH_MSG']);
    this.setColour('%{BKY_PIECES_HUE}');
    this.setTooltip(Blockly.Msg['PIECE_REPLACE_TOOLTIP']);
    this.setHelpUrl("");
  },

  mutationToDom : Blockly.Blocks['piece_object'].mutationToDom,
  domToMutation : Blockly.Blocks['piece_object'].domToMutation,

  /**
   * Updates the shape of this block.
   * @private
   */
  updateShape_ : function(){
    var i = 0;
    var input = this.getInput('DUMMY_INPUT');
    while(this.getField('PROPERTY' + i)){
      input.removeField('PROPERTY' + i);
      i++;
    }

    if (Blockly.Pieces.piecesDB_[this.name]) {
      for(i = 0; i < Blockly.Pieces.piecesDB_[this.name].length; i++){
        var propertyField = new Blockly.FieldPieceProperty(Blockly.Pieces
          .piecesDB_[this.name][i].name);
        propertyField.id = Blockly.Pieces.piecesDB_[this.name][i].id.toString();
        input.appendField(propertyField, "PROPERTY" + i);
      }
    }
  },

  /**
   * Creates the custom context menu for this block.
   * @param options
   */
  customContextMenu: function(options){
    if (!this.isInFlyout) {
      if (Blockly.Pieces.piecesDB_[this.name]){
        for(var i = 0, property; property = Blockly.Pieces
            .piecesDB_[this.name][i]; i++){
          options.push(Blockly.Pieces.createGetPropertyOption(property, this));
        }
      }

      options.push(Blockly.Pieces.createCreatePieceOption(this.name, this));
      if (!Blockly.Pieces.drawersArray.includes(this.name)){
        options.push(Blockly.Pieces.createDrawerOption(this.name, this));
      }
    }
    options.push(Blockly.Pieces.createDeletePieceOption(this.name, this));
  }
};

Blockly.Blocks['piece_draw'] = {
  init: function() {
    var nameLabel = new Blockly.FieldLabel("pieceObject");
    nameLabel.EDITABLE = true; // We want this to save to xml.
    this.appendDummyInput('DUMMY_INPUT')
        .appendField(Blockly.Msg['PIECE_DRAW_DRAW_MSG'])
        .appendField(nameLabel, 'PIECE_NAME');
    this.appendStatementInput("DRAW")
        .setCheck(null)
        .appendField(Blockly.Msg['PIECE_DRAW_WITH_MSG']);
    this.setColour('%{BKY_PIECES_HUE}');
    this.setTooltip(Blockly.Msg['PIECE_DRAW_TOOLTIP']);
    this.setHelpUrl("");
  },

  mutationToDom : Blockly.Blocks['piece_object'].mutationToDom,
  domToMutation : Blockly.Blocks['piece_object'].domToMutation,
  updateShape_ : Blockly.Blocks['piece_replace'].updateShape_,

  /**
   * Creates the custom context menu for this block.
   * @param options
   */
  customContextMenu: function(options){
    if (!this.isInFlyout) {
      if (Blockly.Pieces.piecesDB_[this.name]){
        for(var i = 0, property; property = Blockly.Pieces
            .piecesDB_[this.name][i]; i++){
          options.push(Blockly.Pieces.createGetPropertyOption(property, this));
        }
      }

      options.push(Blockly.Pieces.createCreatePieceOption(this.name, this));
      if (!Blockly.Pieces.replacersArray.includes(this.name)) {
        options.push(Blockly.Pieces.createReplacerOption(this.name, this));
      }
    }
    options.push(Blockly.Pieces.createDeletePieceOption(this.name, this));
  }
};

Blockly.Blocks['piece_property'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("", "NAME");
    this.setOutput(true, null);
    this.setColour('%{BKY_PIECES_HUE}');
    this.setTooltip(Blockly.Msg['PIECE_PROPERTY_TOOLTIP']);
    this.setHelpUrl("");
  },

  /**
   * Checks if this block is in a valid location. If not adds a warning, if
   * yes clears all warnings.
   */
  checkValid: function() {
    var rootBlock = this.getRootBlock();
    if (rootBlock == this) {
      this.setWarningText(null);
    } else if (!(rootBlock.type == 'piece_replace' ||
        rootBlock.type == 'piece_draw') ||
        !Blockly.Pieces.piecesDB_[rootBlock.name].map(a => a.name)
        .includes(this.getFieldValue('NAME'))) {
      this.setWarningText(Blockly.Msg['PIECE_PROPERTY_WARNING']);
      this.setDisabled(true);
    } else {
      this.setWarningText(null);
      this.setDisabled(false);
    }
  }
};

Blockly.Blocks['piece_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['PIECE_START_START_MSG']);
    this.appendStatementInput("START_LIST")
        .setCheck(null);
    this.appendValueInput("ITERATIONS")
        .setCheck("Number")
        .appendField(Blockly.Msg['PIECE_START_REPLACE_MSG']);
    this.appendDummyInput()
        .appendField(Blockly.Msg['PIECE_START_TIMES_DRAW_MSG']);
    this.setInputsInline(true);
    this.setColour('%{BKY_PIECES_HUE}');
 this.setTooltip(Blockly.Msg['PIECE_START_TOOLTIP']);
 this.setHelpUrl("");
  }
};

Blockly.Blocks['piece_mutator_property'] = {
  init: function() {
    var nameField = new Blockly.FieldTextInput(
        Blockly.Msg['PIECE_PROPERTY_DEFAULT_NAME'], this.renameProperty);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg['PIECE_MUTATOR_NAME_MSG'])
        .appendField(nameField, "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_PIECES_HUE}');
    this.setTooltip(Blockly.Msg['PIECE_MUTATOR_TOOLTIP']);
    this.setHelpUrl("");
  },

  /**
   * Makes sure the property has a name unique to the piece.
   * @param {!string} name The initial name.
   * @returns {!string} A name that has been validated.
   */
  renameProperty: function(name){
    name = name.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');

    var isNameUsed_ = function(name, workspace, opt_exclude){
      var blocks = workspace.getAllBlocks();
      for (var i = 0; i < blocks.length; i++){
        if (blocks[i] == opt_exclude){
          continue;
        }
        if (blocks[i].type == 'piece_mutator_property'){
          var propName = blocks[i].getFieldValue('NAME');
          if(Blockly.Names.equals(propName, name)){
            return true;
          }
        }
      }
      return false;
    };
    while(isNameUsed_(name, this.sourceBlock_.workspace, this.sourceBlock_)) {
      var r = name.match(/^(.*?)(\d+)$/);
      if (!r) {
        name += '2';
      } else {
        name = r[1] + (parseInt(r[2], 10) + 1);
      }
    }
    return name;
  }
};

Blockly.Blocks['piece_mutator_container'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['PIECE_MUTATOR_CONTAINER_MSG']);
    this.appendStatementInput("STACK")
        .setCheck(null);
    this.setColour('%{BKY_PIECES_HUE}');
    this.setTooltip(Blockly.Msg['PIECE_MUTATOR_CONTAINER_TOOLTIP']);
    this.setHelpUrl("");
  }
};