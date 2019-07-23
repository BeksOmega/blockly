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

Blockly.Blocks['example_mutator'] = {
  init: function() {
    this.appendValueInput("NAME")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ["is even","EVEN"],
        ["is odd","ODD"],
        ["is prime","PRIME"],
        ["is whole","WHOLE"],
        ["is positive","POSITIVE"],
        ["is negative","NEGATIVE"],
        ["is divisible by","DIVISIBLE_BY"]
      ], this.updateShape_.bind(this)) , "PROPERTY");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setStyle('example_blocks');
  },

  updateShape_: function(newValue) {
    if (newValue == 'DIVISIBLE_BY') {
      this.appendValueInput('DIVISOR')
        .setCheck('Number');
    } else {
      this.removeInput('DIVISOR', true /* opt_quite */);
    }

    return newValue;
  }
};
