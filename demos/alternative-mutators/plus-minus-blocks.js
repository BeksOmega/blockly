/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2019 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blocks for demonstrating using +/- icons for manipulating
 *    the shape of a block.
 * @author bekawestberg@gmail.com (Beka Westberg)
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "controls_if",
    "message0": "%1 %{BKY_CONTROLS_IF_MSG_IF} %2" +
      "%{BKY_CONTROLS_IF_MSG_THEN} %3",
    "args0": [
      {
        "type": "field_plus",
        "name": "PLUS"
      },
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    /*"style": "logic_blocks",*/
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "mutator": "new_controls_if_mutator",
    "extensions": [
      "controls_if_tooltip",
      "suppress_prefix_suffix"
    ]
  },
  {
    "type": "controls_ifelse",
    "message0": " %1 %{BKY_CONTROLS_IF_MSG_IF} %2" +
      "%{BKY_CONTROLS_IF_MSG_THEN} %3" +
      "%{BKY_CONTROLS_IF_MSG_ELSE} %4",
    "args0": [
      {
        "type": "field_plus",
        "name": "PLUS"
      },
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "DO0"
      },
      {
        "type": "input_statement",
        "name": "ELSE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    /*"style": "logic_blocks",*/
    "tooltip": "%{BKYCONTROLS_IF_TOOLTIP_2}",
    "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
    "mutator": "new_controls_if_mutator",
    "extensions": [
      "controls_if_tooltip",
      "suppress_prefix_suffix"
    ]
  },
  {
    "type": "text_join",
    "message0": "%1 %{BKY_TEXT_JOIN_TITLE_CREATEWITH} %2 %3",
    "args0": [
      {
        "type": "field_plus",
        "name": "PLUS"
      },
      {
        "type": "input_value",
        "name": "ADD0"
      },
      {
        "type": "input_value",
        "name": "ADD1"
      }
    ],
    "output": "String",
    "style": "text_blocks",
    "helpUrl": "%{BKY_TEXT_JOIN_HELPURL}",
    "tooltip": "%{BKY_TEXT_JOIN_TOOLTIP}",
    "mutator": "new_text_join_mutator"

  },
]);

Blockly.Constants.SUPPRESS_PREFIX_SUFFIX = {
  /**
   * Don't automatically add STATEMENT_PREFIX and STATEMENT_SUFFIX to generated
   * code.  These will be handled manually in this block's generators.
   */
  suppressPrefixSuffix: true,
};
Blockly.Extensions.registerMixin(
  'suppress_prefix_suffix', Blockly.Constants.SUPPRESS_PREFIX_SUFFIX);

Blockly.Constants.Logic.NEW_CONTROLS_IF_MUTATOR_MIXIN =  {
  elseIfCount_: 0,

  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseIfCount_) {
      return null;
    }
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('elseif', this.elseIfCount_);
    return container;
  },

  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    console.log('dom to mutation');
    this.targetElseIfCount_ =
        parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.rebuildShape_();
  },

  plus: function() {
    this.elseIfCount_++;
    this.addPart_();
    this.updateMinus_();
  },

  minus: function() {
    this.removePart_();
    this.elseIfCount_--;
    this.updateMinus_();
  },

  addPart_: function() {
    this.appendValueInput('IF' + this.elseIfCount_)
      .setCheck('Boolean')
      .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSEIF']);
    this.appendStatementInput('DO' + this.elseIfCount_)
      .appendField(Blockly.Msg['CONTROLS_IF_MSG_THEN']);

    // Handle if/elseif/else block.
    if (this.getInput('ELSE')) {
      this.moveInputBefore('ELSE', /* put at end */ null);
    }
  },

  removePart_: function() {
    this.removeInput('IF' + this.elseIfCount_);
    this.removeInput('DO' + this.elseIfCount_);
  },

  updateMinus_: function() {
    var minusField = this.getField('MINUS');
    if (!minusField) {
      // TODO: This is a time when it would be great to support visibility
      //  on fields.
      this.topInput_.insertFieldAt(1, new plusMinus.FieldMinus(), 'MINUS');
    } else if (!this.elseIfCount_) {
      this.topInput_.removeField('MINUS');
    }
  },

  rebuildShape_: function() {
    console.log(this.elseIfCount_, this.targetElseIfCount_);

    // Tearing down and rebuilding happens to support undo.
    while (this.elseIfCount_ < this.targetElseIfCount_) {
      this.elseIfCount_++;
      this.addPart_();
    }

    while(this.elseIfCount_ > this.targetElseIfCount_) {
      this.removePart_();
      this.elseIfCount_--;
    }

    this.updateMinus_();
  },
};

/**
 * @this {Blockly.Block}
 * @constructor
 */
Blockly.Constants.Logic.NEW_CONTROLS_IF_HELPER_FN = function() {
  this.topInput_ = this.getInput('IF0');
};

Blockly.Extensions.registerMutator(
  'new_controls_if_mutator',
  Blockly.Constants.Logic.NEW_CONTROLS_IF_MUTATOR_MIXIN,
  Blockly.Constants.Logic.NEW_CONTROLS_IF_HELPER_FN
);

Blockly.Constants.Text.NEW_TEXT_JOIN_MUTATOR_MIXIN = {
  itemCount_: 1,

  /**
   * Create XML to represent number of text inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the text inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.rebuildShape_();
  },

  plus: function() {
    this.itemCount_++;
    this.addPart_();
    this.updateMinus_();
  },

  minus: function() {
    this.removePart_();
    this.itemCount_--;
    this.updateMinus_();
  },

  addPart_: function() {
    this.appendValueInput('ADD' + this.itemCount_);
  },

  removePart_: function() {
    this.removeInput('ADD' + this.itemCount_);
  },

  updateMinus_: function() {
    var minusField = this.getField('MINUS');
    if (!minusField) {
      // TODO: This is a time when it would be great to support visibility
      //  on fields.
      this.topInput_.insertFieldAt(1, new plusMinus.FieldMinus(), 'MINUS');
    } else if (this.itemCount_ <= 1) {
      this.topInput_.removeField('MINUS');
    }
  },

  rebuildShape_() {

  }
};

/**
 * @this {Blockly.Block}
 * @constructor
 */
Blockly.Constants.Text.NEW_TEXT_JOIN_HELPER_FN = function() {
  this.topInput_ = this.getInput('ADD0');
};

Blockly.Extensions.registerMutator('new_text_join_mutator',
  Blockly.Constants.Text.NEW_TEXT_JOIN_MUTATOR_MIXIN,
  Blockly.Constants.Text.NEW_TEXT_JOIN_HELPER_FN);
