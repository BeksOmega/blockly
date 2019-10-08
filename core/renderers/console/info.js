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
 * @fileoverview console render info object.
 */
'use strict';

goog.provide('Blockly.console');
goog.provide('Blockly.console.RenderInfo');

goog.require('Blockly.utils.object');


/**
 * An object containing all sizing information needed to draw this block.
 *
 * This measure pass does not propagate changes to the block (although fields
 * may choose to rerender when getSize() is called).  However, calling it
 * repeatedly may be expensive.
 *
 * @param {!Blockly.console.Renderer} renderer The renderer in use.
 * @param {!Blockly.BlockSvg} block The block to measure.
 * @constructor
 * @package
 * @extends {Blockly.blockRendering.RenderInfo}
 */
Blockly.console.RenderInfo = function(renderer, block) {
  Blockly.console.RenderInfo.superClass_.constructor.call(this, renderer, block);

};
Blockly.utils.object.inherits(Blockly.console.RenderInfo,
    Blockly.blockRendering.RenderInfo);

// This just removes setting the min height of the row.
Blockly.console.RenderInfo.prototype.populateTopRow_ = function() {
  var hasHat = this.block_.hat ?
      this.block_.hat === 'cap' : Blockly.BlockSvg.START_HAT;
  var hasPrevious = !!this.block_.previousConnection;
  var leftSquareCorner = this.topRow.hasLeftSquareCorner(this.block_);

  if (leftSquareCorner) {
    this.topRow.elements.push(
        new Blockly.blockRendering.SquareCorner(this.constants_));
  } else {
    this.topRow.elements.push(
        new Blockly.blockRendering.RoundCorner(this.constants_));
  }

  if (hasHat) {
    var hat = new Blockly.blockRendering.Hat(this.constants_);
    this.topRow.elements.push(hat);
    this.topRow.capline = hat.ascenderHeight;
  } else if (hasPrevious) {
    this.topRow.hasPreviousConnection = true;
    this.topRow.connection = new Blockly.blockRendering.PreviousConnection(
        this.constants_,
        /** @type {Blockly.RenderedConnection} */
        (this.block_.previousConnection));
    this.topRow.elements.push(this.topRow.connection);
  }
};

// This just removes setting the min height of the row.
Blockly.console.RenderInfo.prototype.populateBottomRow_ = function() {
  this.bottomRow.hasNextConnection = !!this.block_.nextConnection;

  var leftSquareCorner = this.bottomRow.hasLeftSquareCorner(this.block_);

  if (leftSquareCorner) {
    this.bottomRow.elements.push(
        new Blockly.blockRendering.SquareCorner(this.constants_));
  } else {
    this.bottomRow.elements.push(
        new Blockly.blockRendering.RoundCorner(this.constants_));
  }

  if (this.bottomRow.hasNextConnection) {
    this.bottomRow.connection = new Blockly.blockRendering.NextConnection(
        this.constants_,
        /** @type {Blockly.RenderedConnection} */ (this.block_.nextConnection));
    this.bottomRow.elements.push(this.bottomRow.connection);
  }
};

Blockly.console.RenderInfo.prototype.createRows_ = function() {
  Blockly.console.RenderInfo.superClass_.createRows_.call(this);
  this.firstInputRow = this.rows[1];

  // Assign depth.
  if (this.firstInputRow.hasInlineInput) {
    var inputs = this.firstInputRow.inputs;
    for (var i = 0, input; input = inputs[i]; i++) {
      var target = input.connection.targetBlock();
      if (target) {
        this.block_.depth = Math.max(this.block_.depth, target.depth);
      }
    }
    this.block_.depth++;  // For the fact that we have an inline input.
  } else if (this.firstInputRow.hasExternalInput) {
    // Should only have one input.
    var input = this.firstInputRow.inputs[0];
    var target = input.connection.targetBlock();
    if (target) {
      this.block_.depth = target.depth;
    }
  }
};

Blockly.console.RenderInfo.prototype.getElemCenterline_ = function(row,
    elem) {
  if (row == this.firstInputRow) {
    var top = row.yPos;
    var offsetFromTop = 0;
    if (Blockly.blockRendering.Types.isInlineInput(elem)) {
      var targetBlock = elem.input.connection.targetBlock();
      if (!targetBlock || targetBlock.depth != this.block_.depth - 1) {
        offsetFromTop = (this.block_.depth - 1) * this.constants_.MIN_TOP_HEIGHT;
      }
      // TODO: targetBlock check might not be needed.
      if (targetBlock && elem.height == row.height) {
        row.height += offsetFromTop;
      }
    } else if (Blockly.blockRendering.Types.isField(elem)) {
      // TODO: Check that this works when the field is taller than the tab.
      var leftOverHeight = this.constants_.TAB_HEIGHT - elem.height;
      offsetFromTop += this.block_.depth * this.constants_.MIN_TOP_HEIGHT;
      offsetFromTop += leftOverHeight / 2;
    }
    return top + offsetFromTop + elem.height / 2;
  }
  return Blockly.console.RenderInfo.superClass_.getElemCenterline_
      .call(this, row, elem);
};

Blockly.console.RenderInfo.prototype.addRowSpacing_ = function() {
  var oldRows = this.rows;
  this.rows = [];

  for (var r = 0, oldRow; oldRow = oldRows[r]; r++) {
    this.rows.push(oldRow);
    if (Blockly.blockRendering.Types.isBottomRow(oldRow)) {
      continue;
    }
    if (Blockly.blockRendering.Types.isTopRow(oldRow) &&
        !oldRow.hasPreviousConnection) {
      continue;
    }
    var oldNextRow = oldRows[r + 1];
    if (Blockly.blockRendering.Types.isBottomRow(oldNextRow) &&
        !oldNextRow.hasNextConnection) {
      continue;
    }
    this.rows.push(this.makeSpacerRow_(oldRow, oldNextRow));
  }
};

Blockly.console.RenderInfo.prototype.getSpacerRowHeight_ = function(
    _prev, _next) {
  return this.constants_.MIN_TOP_HEIGHT + this.constants_.MIN_BOTTOM_HEIGHT;
};

// This just moves the yCursor bump to after recordElemPositions.
Blockly.console.RenderInfo.prototype.finalize_ = function() {
  // Performance note: this could be combined with the draw pass, if the time
  // that this takes is excessive.  But it shouldn't be, because it only
  // accesses and sets properties that already exist on the objects.
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
};

/**
 * Get the block renderer in use.
 * @return {!Blockly.console.Renderer} The block renderer in use.
 * @package
 */
Blockly.console.RenderInfo.prototype.getRenderer = function() {
  return /** @type {!Blockly.console.Renderer} */ (this.renderer_);
};
