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
      var elements = row.elements;
      for (var i = 0, element; element = elements[i]; i++) {
        if (Blockly.blockRendering.Types.isInlineInput(element)) {
          var target = element.input.connection.targetBlock();
          if (target) {
            foundTarget = true;
            row.centerline = Math.max(row.centerline, target.centerline);
          }
        }
      }
    } else if (row.hasExternalInput) {
      var input = row.getLastInput();
      var target = input.connection.targetBlock();
      if (target) {
        foundTarget = true;
        row.centerline = target.centerline;
      }
    }

    if (!foundTarget) {
      row.centerline += row.height / 2;
    }
  }
  this.firstInputRow = this.rows[1];
};

/**
 * Calculate the centerline of an element in a rendered row.
 * @param {!Blockly.blockRendering.Row} row The row containing the element.
 * @param {!Blockly.blockRendering.Measurable} elem The element to place.
 * @return {number} The desired centerline of the given element, as an offset
 *     from the top left of the block.
 * @protected
 */
Blockly.baseline.RenderInfo.prototype.getElemCenterline_ = function(row, elem) {
  var offset = 0;
  if (Blockly.blockRendering.Types.isInlineInput(elem)) {
    var target = elem.input.connection.targetBlock();
    if (target && target.centerline != elem.height / 2) {
      // The difference between the element's natural centerline
      // (elem.height / 2) and where it should be (target.centerline)
      offset = elem.height / 2 - target.centerline;
      // The amount of the target below the target's centerline.
      var hangingHeight = target.height - target.centerline;
      var elementBottom = row.centerline + hangingHeight;
      // If the element is beyond the bounds of the row.
      if (elementBottom > row.height) {
        row.height = elementBottom;
      }
    }
  }
  return row.centerline + row.yPos + offset;
};

/**
 * Make any final changes to the rendering information object.  In particular,
 * store the y position of each row, and record the height of the full block.
 * @protected
 */
Blockly.baseline.RenderInfo.prototype.finalize_ = function() {
  // This is all duplicated, the `yCursor += row.height;` line is just moved
  // to the end of the loop.
  var widestRowWithConnectedBlocks = 0;
  var yCursor = 0;
  for (var i = 0, row; (row = this.rows[i]); i++) {
    row.yPos = yCursor;
    row.xPos = this.startX;

    widestRowWithConnectedBlocks =
      Math.max(widestRowWithConnectedBlocks, row.widthWithConnectedBlocks);
    this.recordElemPositions_(row);
    yCursor += row.height;
  }

  this.widthWithChildren = widestRowWithConnectedBlocks + this.startX;

  this.height = yCursor;
  this.startY = this.topRow.capline;
  this.bottomRow.baseline = yCursor - this.bottomRow.descenderHeight;

  // New stuff.
  var firstInputRow = this.firstInputRow;
  this.block_.centerline = firstInputRow.yPos + firstInputRow.centerline;
};
