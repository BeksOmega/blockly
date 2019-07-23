/**
 * @license
 * Blockly User Summit 2019 Fields Demos
 *
 * Copyright 2019 Beka Westberg
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
'use strict';

/*
 * Note: In the 2019 Q3 release tooltips can be set via JSON, but this is
 *  built on 2019 Q2.
 */

Blockly.Blocks['example_tooltips'] = {
  init: function() {
    var label = new Blockly.FieldLabel('default');
    label.setTooltip('All');
    var image = new Blockly.FieldImage(
        "https://www.gstatic.com/codesite/ph/images/star_on.gif", 20, 20, "*");
    image.setTooltip('Fields');
    var text = new Blockly.FieldTextInput('default');
    text.setTooltip('Now');
    var colour = new Blockly.FieldColour('#ff0000');
    colour.setTooltip('Support');
    var dropdown = new Blockly.FieldDropdown([["default","OPTIONNAME"]]);
    dropdown.setTooltip('Tooltips');

    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(label);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(image);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(text, "TEXT");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(colour, "COLOUR");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(dropdown, "OPTION");
    this.setStyle('example_blocks');
  }
};

Blockly.Blocks['example_tooltip_hiding'] = {
  init: function() {
    var colour = new Blockly.FieldColour('#ff0000');

    this.appendDummyInput()
      .appendField(colour, "COLOUR");
    this.setOutput(true, null);
    this.setStyle('example_blocks');
    this.setTooltip('This is a block tooltip.')
  }
};

Blockly.Blocks['example_tooltip_dynamic'] = {
  init: function() {
    var text = new Blockly.FieldLabel('text:');
    text.setTooltip(function() {
      return 'Tooltips can be dynamic: ' + this.getFieldValue('INPUT')
    }.bind(this));

    this.appendDummyInput()
      .appendField(text)
      .appendField(new Blockly.FieldTextInput('default'), 'INPUT');
    this.setStyle('example_blocks');
    this.setTooltip('This is a block tooltip.')
  }
};
