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

Blockly.defineBlocksWithJsonArray([
  {
    "type": "editable_dropdown",
    "message0": "dropdowns: %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "option1",
            "OPTIONNAME"
          ]
        ]
      }
    ],
    "style": "fields_editable"
  },
  {
    "type": "editable_colour",
    "message0": "colours: %1",
    "args0": [
      {
        "type": "field_colour",
        "name": "NAME",
        "colour": "#ff0000"
      }
    ],
    "style": "fields_editable"
  },
  {
    "type": "editable_text",
    "message0": "text: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "NAME",
        "text": "input"
      }
    ],
    "style": "fields_editable"
  },
  {
    "type": "noneditable_label",
    "message0": "labels: hey that's me!",
    "style": "fields_noneditable"
  },
  {
    "type": "noneditable_image",
    "message0": "images: %1",
    "args0": [
      {
        "type": "field_image",
        "src": "https://www.gstatic.com/codesite/ph/images/star_on.gif",
        "width": 15,
        "height": 15,
        "alt": "*",
        "flipRtl": false
      }
    ],
    "style": "fields_noneditable"
  },
  {
    "type": "icons_mutator",
    "message0": "mutations",
    "style": "icons",
    "mutator": "controls_if_mutator",
  }
]);

Blockly.Blocks['icons_comment'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('comments');
    this.setStyle('icons');
    this.setCommentText('A comment.');
  }
};

Blockly.Blocks['icons_warning'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('warnings');
    this.setStyle('icons');
    this.setWarningText('A warning.');
  }
};

/*<xml>
  <block type="editable_dropdown"/>
  <block type="editable_colour"/>
  <block type="editable_text"/>
  <block type="noneditable_label"/>
  <block type="noneditable_image"/>
  <block type="icons_comment"/>
  <block type="icons_warning"/>
  <block type="icons_mutator"/>
</xml>*/
