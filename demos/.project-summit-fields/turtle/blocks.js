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

/* Retrieved from Blockly: https://github.com/google/blockly */
'use strict';

Blockly.Blocks['turtle_basic'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField('simple turtle');
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(new CustomFields.FieldTurtle(), 'TURTLE');
    this.setStyle('example_blocks');
  }
};

Blockly.Blocks['turtle_nullifier'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField('no trademarks');
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField(new CustomFields.FieldTurtle(null, null, null, this.validate)
        , 'TURTLE');
    this.setStyle('example_blocks');
  },

  validate: function(newValue) {
    this.cachedValidatedValue_ = Object.assign({}, newValue);
    if ((newValue.turtleName == 'Leonardo' && newValue.hat == 'Mask') ||
      (newValue.turtleName == 'Yertle' && newValue.hat == 'Crown') ||
      (newValue.turtleName == 'Franklin') && newValue.hat == 'Propeller') {

      var currentValue = this.getValue();
      if (newValue.turtleName != currentValue.turtleName) {
        // Turtle name changed.
        this.cachedValidatedValue_.turtleName = null;
      } else {
        // Hat must have changed.
        this.cachedValidatedValue_.hat = null;
      }

      return null;
    }
    return newValue;
  }
};
