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
 * @fileoverview baseline render info object.
 */
'use strict';

goog.provide('Blockly.baseline');
goog.provide('Blockly.baseline.RenderInfo');

goog.require('Blockly.utils.object');


/**
 * An object containing all sizing information needed to draw this block.
 *
 * This measure pass does not propagate changes to the block (although fields
 * may choose to rerender when getSize() is called).  However, calling it
 * repeatedly may be expensive.
 *
 * @param {!Blockly.baseline.Renderer} renderer The renderer in use.
 * @param {!Blockly.BlockSvg} block The block to measure.
 * @constructor
 * @package
 * @extends {Blockly.blockRendering.RenderInfo}
 */
Blockly.baseline.RenderInfo = function(renderer, block) {
  Blockly.baseline.RenderInfo.superClass_.constructor.call(this, renderer, block);
};
Blockly.utils.object.inherits(Blockly.baseline.RenderInfo,
    Blockly.blockRendering.RenderInfo);

/**
 * Apply a centerline to the different rows and to the block once the height
 * of the row has been determined.
 * @protected
 */
Blockly.baseline.RenderInfo.prototype.computeBounds_ = function() {
  Blockly.baseline.RenderInfo.superClass_.computeBounds_.call(this);
  for (var i = 0, row; row = this.rows[i]; i++) {
    row.centerline = 0;
    var foundTarget;
    if (row.hasInlineInput) {
      var inputs = row.inputs;
      for (var i = 0, input; input = inputs[i]; i++) {
        var target = input.connection.targetBlock();
        if (target) {
          foundTarget = true;
          row.centerline = Math.max(row.centerline, target.centerline);
        }
      }
    }

    if (!foundTarget) {
      row.centerline += row.height / 2;
    }
  }
  this.firstInputRow = this.rows[1];
};

/**
 * Make any final changes to the rendering information object.  In particular,
 * store the y position of each row, and record the height of the full block.
 * @protected
 */
Blockly.baseline.RenderInfo.prototype.finalize_ = function() {
  Blockly.baseline.RenderInfo.superClass_.finalize_.call(this);
  var firstInputRow = this.firstInputRow;
  this.block_.centerline = firstInputRow.yPos + firstInputRow.centerline;
};
