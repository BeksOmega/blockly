'using strict';

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

  mutationToDom: function(){
    if (!this.name){
      this.name = this.getFieldValue('PIECE_NAME');
    }
		
		var container = document.createElement('mutation')
    container.setAttribute('name', this.name);
		return container;
	},

	domToMutation: function(xmlElement){
    this.name = xmlElement.getAttribute('name');
		this.updateShape_();
	},

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('piece_mutator_container');
    containerBlock.initSvg();

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

    return containerBlock;
  },

  compose: function(containerBlock){
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
    Blockly.Pieces.piecesDB_[this.name]  = [];

    // Save all of our property objects (name, ID) to the database.
    // Also collect up all of the input connections (while we're looping
    // through the blocks) so that we can reconnect them.
    var inputConnections = [];
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
      inputConnections.push(propertyBlock.inputConnection);
      Blockly.Pieces.piecesDB_[this.name].push(object);
      propertyBlock = propertyBlock.nextConnection && 
        propertyBlock.nextConnection.targetBlock();
    }
    this.updateShape_();

    // Reconnect all of the our input blocks.
    for (var i = 0; i < inputConnections.length; i++) {
      Blockly.Mutator.reconnect(inputConnections[i], this, 'PROPERTY_INPUT' + (i + 1))
    }

    // Update all of the other blocks associated with this piece.
    var blocks = this.workspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++){
      if (blocks[i] == this) {
        continue;
      }
      var type = blocks[i].type;
      if ((type == 'piece_object'
          || type == 'piece_replace'
          || type == 'piece_draw') &&
          blocks[i].getFieldValue('PIECE_NAME')
          == this.getFieldValue('PIECE_NAME')){
        blocks[i].updateShape_();
      }
      if (type == 'piece_property'){
        var data = blocks[i].data.split(",");
        if (data[0] == this.name){
          var name = null;
          for(var j = 0, property; property = Blockly.Pieces
              .piecesDB_[this.name][j]; j++){
            if (data[1] == property.id){
              var name = property.name;
              break;
            }
          }
          // If the property has not been deleted.
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
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var propertyBlock = containerBlock.getFirstStatementConnection()
        .targetBlock();
    var i = 1;
    while (propertyBlock) {
      var input = this.getInput('PROPERTY_INPUT' + i);
      propertyBlock.inputConnection = input && input.connection
          .targetConnection;
      i++;
      propertyBlock = propertyBlock.nextConnection &&
          propertyBlock.nextConnection.targetBlock();
    }
  },

	updateShape_: function(){
    var i = 1;
    while(this.getInput('PROPERTY_INPUT' + i)) {
      this.removeInput('PROPERTY_INPUT' + i);
      i++;
    }

    if (Blockly.Pieces.piecesDB_[this.name]){
      for(var i = 0, property; property = Blockly.Pieces
          .piecesDB_[this.name][i]; i++){
        this.appendValueInput('PROPERTY_INPUT' + (i + 1))
          .setCheck(null)
          .appendField(property.name, 'PROPERTY_NAME' + (i + 1));
      }
    }
	},

  disableProperties: true,

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
  updateShape_ : function(){
    var i = 1;
		var input = this.getInput('DUMMY_INPUT');
		while(this.getField('PROPERTY' + i)){
			input.removeField('PROPERTY' + i);
      i++;
		}

    if (Blockly.Pieces.piecesDB_[this.name]) {
		  for(i = 0; i < Blockly.Pieces.piecesDB_[this.name].length; i++){
        var propertyField = new Blockly.FieldPieceProperty(Blockly.Pieces
            .piecesDB_[this.name][i].name, this.disableProperties);
        propertyField.id = Blockly.Pieces.piecesDB_[this.name][i].id.toString();
			  input.appendField(propertyField, "PROPERTY" + (i + 1));
		  }
    }
  },
  disableProperties: false,

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
  disableProperties: false,

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

  checkValid: function() {
    rootBlock = this.getRootBlock();
    if (rootBlock == this) {
      this.setWarningText(null);
    } else if (!(rootBlock.type == 'piece_replace'
        || rootBlock.type == 'piece_draw')
        || !Blockly.Pieces.piecesDB_[rootBlock.name].map(a => a.name)
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