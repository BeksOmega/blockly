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

Blockly.console.RenderInfo.prototype.createRows_ = function() {
  this.populateTopRow_();
  this.rows.push(this.topRow);
  var activeRow = new Blockly.blockRendering.InputRow(this.constants_);
  this.firstInputRow = activeRow;

  // Icons always go on the first row, before anything else.
  var icons = this.block_.getIcons();
  if (icons.length) {
    for (var i = 0, icon; (icon = icons[i]); i++) {
      var iconInfo = new Blockly.blockRendering.Icon(this.constants_, icon);
      if (this.isCollapsed && icon.collapseHidden) {
        this.hiddenIcons.push(iconInfo);
      } else {
        activeRow.elements.push(iconInfo);
      }
    }
  }

  var lastInput = null;
  // Loop across all of the inputs on the block, creating objects for anything
  // that needs to be rendered and breaking the block up into visual rows.
  for (var i = 0, input; (input = this.block_.inputList[i]); i++) {
    if (!input.isVisible()) {
      continue;
    }
    if (this.shouldStartNewRow_(input, lastInput)) {
      // Finish this row and create a new one.
      this.rows.push(activeRow);
      activeRow = new Blockly.blockRendering.InputRow(this.constants_);
    }

    // All of the fields in an input go on the same row.
    for (var j = 0, field; (field = input.fieldRow[j]); j++) {
      activeRow.elements.push(
          new Blockly.blockRendering.Field(this.constants_, field, input));
    }
    this.addInput_(input, activeRow);
    lastInput = input;
  }

  if (this.isCollapsed) {
    activeRow.hasJaggedEdge = true;
    activeRow.elements.push(
        new Blockly.blockRendering.JaggedEdge(this.constants_));
  }

  if (activeRow.elements.length || activeRow.hasDummyInput) {
    this.rows.push(activeRow);
  }
  this.populateBottomRow_();
  this.rows.push(this.bottomRow);
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

/**
 * Get the block renderer in use.
 * @return {!Blockly.console.Renderer} The block renderer in use.
 * @package
 */
Blockly.console.RenderInfo.prototype.getRenderer = function() {
  return /** @type {!Blockly.console.Renderer} */ (this.renderer_);
};
