'use strict';

Blockly.Blocks['turtle_forward'] = {
  init: function() {
    this.appendValueInput("FORWARD")
        .setCheck("Number")
        .appendField(Blockly.Msg['TURTLE_FORWARD_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
    this.setTooltip(Blockly.Msg['TURTLE_FORWARD_TOOTLIP']);
    this.setHelpUrl("");
  },

  checkValid: function() {
    var rootBlock = this.getRootBlock();
    if (rootBlock.type == 'piece_replace' || rootBlock.type == 'piece_start'){
      this.setWarningText(Blockly.Msg['TURTLE_WARNING']);
      this.setDisabled(true);
    } else {
      this.setWarningText(null);
    }
  }
};

Blockly.Blocks['turtle_right'] = {
  init: function() {
    this.appendValueInput("RIGHT")
        .setCheck("Number")
        .appendField(Blockly.Msg['TURTLE_RIGHT_MSG']);
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_DEGREES']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_RIGHT_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_left'] = {
  init: function() {
    this.appendValueInput("LEFT")
        .setCheck("Number")
        .appendField(Blockly.Msg['TURTLE_LEFT_MSG']);
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_DEGREES']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_LEFT_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_width'] = {
  init: function() {
    this.appendValueInput("WIDTH")
        .setCheck("Number")
        .appendField(Blockly.Msg['TURTLE_WIDTH_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_WIDTH_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_colour'] = {
  init: function() {
    this.appendValueInput("COLOUR")
        .setCheck("Colour")
        .appendField(Blockly.Msg['TURTLE_COLOUR_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_COLOUR_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_getcolour'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_GET_COLOUR_MSG']);
    this.setInputsInline(true);
    this.setOutput(true, "Colour");
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_GET_COLOUR_MSG']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_getwidth'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_GET_WIDTH_MSG']);
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_GET_WIDTH_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_savestate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_SAVE_STATE_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_SAVE_STATE_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_restorestate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_RESTORE_STATE_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_RESTORE_STATE_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_clear'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_CLEAR_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_CLEAR_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_penup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_PEN_UP_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_PEN_UP_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};

Blockly.Blocks['turtle_pendown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['TURTLE_PEN_DOWN_MSG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_TURTLE_HUE}');
 this.setTooltip(Blockly.Msg['TURTLE_PEN_DOWN_TOOLTIP']);
 this.setHelpUrl("");
  },

  checkValid: Blockly.Blocks['turtle_forward'].checkValid
};