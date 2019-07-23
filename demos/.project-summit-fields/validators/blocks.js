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

Blockly.Blocks['example_text_alphabet'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("latin alphabet")
      .appendField(new Blockly.FieldTextInput("default", this.validate), "INPUT");
    this.setStyle('example_blocks');
  },

  validate: function(newValue) {
    return newValue.replace(/([^A-Za-z])/g, '');
  }
};
Blockly.Blocks['example_number_parity'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("number parity")
      .appendField(new Blockly.FieldNumber(1, null, null, null, this.validate), "INPUT");
    this.setStyle('example_blocks');
  },

  validate: function(newValue) {
    return newValue % 2;
  }
};

Blockly.Blocks['example_date_null'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("weekdays")
      .appendField(new Blockly.FieldDate("2020-02-20", this.validate), "INPUT");
    this.setStyle('example_blocks');
  },

  validate: function(newValue) {
    var date = goog.date.Date.fromIsoString(newValue);
    var weekday = date.getWeekday();
    if (weekday == 0 || weekday == 6) {
      return null;
    }
    return date.toIsoString(true);
  }
};
Blockly.Blocks['example_text_null'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("grumpy alphabet")
      .appendField(new Blockly.FieldTextInput("default", this.validate), "INPUT");
    this.setStyle('example_blocks');
  },

  validate: function(newValue) {
    if (newValue.match(/([^A-Za-z])/g)) {
      return null;
    }
    return newValue;
  }
};
