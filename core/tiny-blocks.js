/**
 * @license
 * Tiny Shadow Blocks
 *
 * Copyright 2019 Rebekah Westberg
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
    "type": "tiny_angle_compass",
    "message0": "%1",
    "args0": [
      {
        "type": "field_angle",
        "name": "ANGLE",
        "mode": "compass"
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_angle_protractor",
    "message0": "%1",
    "args0": [
      {
        "type": "field_angle",
        "name": "ANGLE",
        "mode": "protractor"
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_angle_left",
    "message0": "%1",
    "args0": [
      {
        "type": "field_angle",
        "name": "ANGLE",
        "offset": 90
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_angle_right",
    "message0": "%1",
    "args0": [
      {
        "type": "field_angle",
        "name": "ANGLE",
        "offset": 90,
        "clockwise": true,
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_angle_protractor_negative",
    "message0": "%1",
    "args0": [
      {
        "type": "field_angle",
        "name": "ANGLE",
        "wrap": 180
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_checkbox",
    "message0": "%1",
    "args0": [
      {
        "type": "field_checkbox",
        "name": "CHECK",
        "checked": true
      }
    ],
    "output": "Boolean",
    "colour": 210,
    /*"style": "logic_blocks"*/
  },
  {
    "type": "tiny_number_natural",
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUMBER",
        "min": 1,
        "precision": 1
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_number_whole",
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUMBER",
        "min": 0,
        "precision": 1
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_number_positive",
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUMBER",
        "min": 0
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_number_negative",
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUMBER",
        "max": 0
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
  {
    "type": "tiny_number_percent",
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUMBER",
        "min": 0,
        "max": 1,
        "precision": .001
      }
    ],
    "output": "Number",
    "colour": 230,
    /*"style": "math_blocks"*/
  },
]);

Blockly.JavaScript['tiny_angle_compass'] = function(block) {
  var value = block.getFieldValue('ANGLE');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_angle_protractor'] = function(block) {
  var value = block.getFieldValue('ANGLE');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_angle_left'] = function(block) {
  var value = block.getFieldValue('ANGLE');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_angle_right'] = function(block) {
  var value = block.getFieldValue('ANGLE');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_angle_protractor_negative'] = function(block) {
  var value = block.getFieldValue('ANGLE');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_checkbox'] = function(block) {
  var value = block.getFieldValue('CHECK') == 'TRUE';
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_number_natural'] = function(block) {
  var value = block.getFieldValue('NUMBER');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_number_whole'] = function(block) {
  var value = block.getFieldValue('NUMBER');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_number_positive'] = function(block) {
  var value = block.getFieldValue('NUMBER');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_number_negative'] = function(block) {
  var value = block.getFieldValue('NUMBER');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['tiny_number_percent'] = function(block) {
  var value = block.getFieldValue('NUMBER');
  return [value, Blockly.JavaScript.ORDER_ATOMIC];
};
