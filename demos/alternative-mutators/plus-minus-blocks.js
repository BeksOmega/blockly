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
    "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1 %{BKY_CONTROLS_IF_MSG_THEN} %2",
    "args0": [
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
      "plus_minus",
      "suppress_prefix_suffix"
    ]
  },
  {
    "type": "controls_ifelse",
    "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1 %{BKY_CONTROLS_IF_MSG_THEN} %2" +
      "%{BKY_CONTROLS_IF_MSG_ELSE} %3",
    "args0": [
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
      "plus_minus",
      "suppress_prefix_suffix"
    ]
  },
]);

Blockly.Constants.PLUS_MINUS_MIXIN = {
  // TODO: This could also be a custom field.
  createPlusField_: function() {
    return new Blockly.FieldImage(
      'media/plus.svg',
      15, 15, '+', this.plus.bind(this));
  },

  // TODO: This could also be a custom field.
  createMinusField_: function() {
    return new Blockly.FieldImage(
      'media/minus.svg',
      15, 15, '+', this.minus.bind(this));
  },
};
Blockly.Extensions.registerMixin(
    'plus_minus', Blockly.Constants.PLUS_MINUS_MIXIN);

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
  elseifCount_: 0,

  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_) {
      return null;
    }
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('elseif', this.elseifCount_);
    return container;
  },

  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.rebuildShape_();
  },

  plus: function() {
    this.elseifCount_++;
    this.addPart_();
    this.updateMinus_();
  },

  minus: function() {
    this.removePart_();
    this.elseifCount_--;
    this.updateMinus_();
  },

  addPart_: function() {
    this.appendValueInput('IF' + this.elseifCount_)
      .setCheck('Boolean')
      .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSEIF']);
    this.appendStatementInput('DO' + this.elseifCount_)
      .appendField(Blockly.Msg['CONTROLS_IF_MSG_THEN']);

    // Handle if/elseif/else block.
    if (this.getInput('ELSE')) {
      this.moveInputBefore('ELSE', /* put at end */ null);
    }
  },

  removePart_: function() {
    this.removeInput('IF' + this.elseifCount_);
    this.removeInput('DO' + this.elseifCount_);
  },

  updateMinus_: function() {
    var minusField = this.getField('MINUS');
    if (!minusField) {
      // TODO: This is a time when it would be great to support visibility
      //  on fields.
      this.topInput_.insertFieldAt(1, this.createMinusField_(), 'MINUS');
    } else if (!this.elseifCount_) {
      this.topInput_.removeField('MINUS');
    }
  },

  rebuildShape_: function() {
    for(var i = 0; i < this.elseifCount_; i++) {
      this.addPart_();
    }
    if (this.elseifCount_) {
      this.updateMinus_();
    }
  },
};
/**
 * @this {Blockly.Block}
 * @constructor
 */
Blockly.Constants.Logic.NEW_CONTROLS_IF_HELPER_FN = function() {
  this.topInput_ = this.getInput('IF0');
  this.topInput_.insertFieldAt(0, this.createPlusField_(), 'PLUS');
};
Blockly.Extensions.registerMutator(
  'new_controls_if_mutator',
  Blockly.Constants.Logic.NEW_CONTROLS_IF_MUTATOR_MIXIN,
  Blockly.Constants.Logic.NEW_CONTROLS_IF_HELPER_FN
);
