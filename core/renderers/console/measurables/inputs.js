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
 * @fileoverview Objects representing inputs with connections on a rendered
 * block.
 * @author kozbial@google.com (Monica Kozbial)
 */
'use strict';

goog.provide('Blockly.console.InlineInput');
goog.provide('Blockly.console.StatementInput');

goog.require('Blockly.blockRendering.Connection');
goog.require('Blockly.utils.object');

/**
 * An object containing information about the space an inline input takes up
 * during rendering
 * @param {!Blockly.blockRendering.ConstantProvider} constants The rendering
 *   constants provider.
 * @param {!Blockly.Input} input The inline input to measure and store
 *     information for.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.InputConnection}
 */
Blockly.console.InlineInput = function(constants, input) {
  Blockly.console.InlineInput.superClass_.constructor.call(
      this, constants, input);

  if (this.connectedBlock && !this.connectedBlock.isShadow()) {
    // We allow the dark path to show on the parent block so that the child
    // block looks embossed.  This takes up an extra pixel in both x and y.
    this.width += this.constants_.THICKER_BORDER_OFFSET;
    this.height += this.constants_.THICKER_BORDER_OFFSET;
  }
};
Blockly.utils.object.inherits(Blockly.console.InlineInput,
    Blockly.blockRendering.InlineInput);

/**
 * An object containing information about the space a statement input takes up
 * during rendering
 * @param {!Blockly.blockRendering.ConstantProvider} constants The rendering
 *   constants provider.
 * @param {!Blockly.Input} input The statement input to measure and store
 *     information for.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.InputConnection}
 */
Blockly.console.StatementInput = function(constants, input) {
  Blockly.console.StatementInput.superClass_.constructor.call(
      this, constants, input);

  if (this.connectedBlock) {
    // We allow the dark path to show on the parent block so that the child
    // block looks embossed.  This takes up an extra pixel in both x and y.
    this.height += this.constants_.BOTTOM_BORDER_WIDTH;
  }
};
Blockly.utils.object.inherits(Blockly.console.StatementInput,
    Blockly.blockRendering.StatementInput);
