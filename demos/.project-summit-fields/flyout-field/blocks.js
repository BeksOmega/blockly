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
    "type": "example_flyout",
    "message0": "%1",
    "args0": [
      {
        "type": "field_flyout",
        "name": "FLYOUT",
        "flyoutKey": 'BLOCK_FLYOUT',
        "foldoutText": "helper blocks",
        "sizingBehavior": "fitContent",
      }
    ],
    "style": "example_blocks"
  },
]);

Blockly.blockFlyoutCallback = function(workspace) {
  return [
    Blockly.Xml.textToDom('<block type="controls_if"/>'),
    Blockly.Xml.textToDom(
      '<block type="controls_if">' +
      '  <next>' +
      '    <block type="controls_if"/>' +
      '  </next>' +
      '</block>'),
  ];
};
