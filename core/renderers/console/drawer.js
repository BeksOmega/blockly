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
 * @fileoverview console rendering drawer.
 */
'use strict';

goog.provide('Blockly.console.Drawer');

goog.require('Blockly.blockRendering.Drawer');
goog.require('Blockly.utils.object');
goog.require('Blockly.console.RenderInfo');


/**
 * An object that draws a block based on the given rendering information.
 * @param {!Blockly.BlockSvg} block The block to render.
 * @param {!Blockly.console.RenderInfo} info An object containing all
 *   information needed to render this block.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.Drawer}
 */
Blockly.console.Drawer = function(block, info) {
  Blockly.console.Drawer.superClass_.constructor.call(this, block, info);
};
Blockly.utils.object.inherits(Blockly.console.Drawer,
    Blockly.blockRendering.Drawer);

Blockly.console.Drawer.prototype.draw = function() {
  this.hideHiddenIcons_();

  this.outlinePath_ +=
    Blockly.utils.svgPaths.moveBy(this.info_.topRow.xPos, this.info_.startY);
  this.drawOutline_();
  this.drawInternals_();
  var mainPath = this.outlinePath_ + '\n' + this.inlinePath_;

  this.outlinePath_ = '';
  this.outlinePath_ += Blockly.utils.svgPaths.moveTo(0,
      this.info_.bottomRow.baseline + this.constants_.BOTTOM_BORDER_WIDTH / 2);
  if (this.info_.outputConnection) {
    this.outlinePath_ += Blockly.utils.svgPaths.moveBy(this.constants_.TAB_WIDTH, 0);
  }
  this.drawLeft_(true);
  this.drawTop_();
  var topLeft = this.outlinePath_;

  this.outlinePath_ = '';
  this.outlinePath_ += Blockly.utils.svgPaths.moveTo(
      // TODO: Idk where this +1 is coming from.
      this.info_.width, -this.constants_.TOP_BORDER_WIDTH / 2);
  this.drawRight_();
  this.drawBottom_();
  var bottomRight = this.outlinePath_;

  this.block_.pathObject.setPaths(mainPath, topLeft, bottomRight);
  if (this.info_.RTL) {
    this.block_.pathObject.flipRTL();
  }
  if (Blockly.blockRendering.useDebugger) {
    this.block_.renderingDebugger.drawDebug(this.block_, this.info_);
  }
  this.recordSizeOnBlock_();
};

// This just moves the move call up to the draw method.
Blockly.console.Drawer.prototype.drawTop_ = function() {
  var topRow = this.info_.topRow;
  var elements = topRow.elements;

  this.positionPreviousConnection_();
  for (var i = 0, elem; (elem = elements[i]); i++) {
    if (Blockly.blockRendering.Types.isLeftRoundedCorner(elem)) {
      this.outlinePath_ +=
        this.constants_.OUTSIDE_CORNERS.topLeft;
    } else if (Blockly.blockRendering.Types.isPreviousConnection(elem)) {
      this.outlinePath_ += elem.shape.pathLeft;
    } else if (Blockly.blockRendering.Types.isHat(elem)) {
      this.outlinePath_ += this.constants_.START_HAT.path;
    } else if (Blockly.blockRendering.Types.isSpacer(elem)) {
      this.outlinePath_ += Blockly.utils.svgPaths.lineOnAxis('h', elem.width);
    }
    // No branch for a square corner, because it's a no-op.
  }
};

Blockly.console.Drawer.prototype.drawRight_ = function() {
  this.outlinePath_ += Blockly.utils.svgPaths.lineOnAxis('v', this.info_.topRow.height);
  for (var r = 1; r < this.info_.rows.length - 1; r++) {
    var row = this.info_.rows[r];
    if (row.hasJaggedEdge) {
      this.drawJaggedEdge_(row);
    } else if (row.hasStatement) {
      this.drawStatementInput_(row);
    } else if (row.hasExternalInput) {
      this.drawValueInput_(row);
    } else {
      this.drawRightSideRow_(row);
    }
  }
};

/**
 * Add steps for the left side of the block, which may include an output
 * connection
 * @protected
 */
Blockly.console.Drawer.prototype.drawLeft_ = function(addExtraHeight) {
  var outputConnection = this.info_.outputConnection;
  this.positionOutputConnection_();

  if (outputConnection) {
    var tabTop = (this.block_.depth + 1) * this.constants_.MIN_TOP_HEIGHT;
    var tabBottom = tabTop + outputConnection.height;
    var pathUp = outputConnection.shape.pathUp;
    // Draw a line up to the bottom of the tab.
    this.outlinePath_ +=
        Blockly.utils.svgPaths.lineOnAxis('V', tabBottom) +
        pathUp +
        Blockly.utils.svgPaths.lineOnAxis('v', -tabTop);
  } else {
    var height = -this.info_.bottomRow.baseline;
    if (addExtraHeight) {
      height -= this.constants_.BOTTOM_BORDER_WIDTH / 2;
    }
    this.outlinePath_ +=
        Blockly.utils.svgPaths.lineOnAxis('v', height);
  }
};

Blockly.console.Drawer.prototype.drawInlineInput_ = function(input) {
  var width = input.width;
  var height = input.height;
  var yPos = input.centerline - height / 2;


  var connectionTop = this.constants_.MIN_TOP_HEIGHT;
  var target = input.input.connection.targetBlock();
  if (target) {
    connectionTop += target.depth * this.constants_.MIN_TOP_HEIGHT;
  }

  var connectionBottom = connectionTop + input.connectionHeight;
  var connectionRight = input.xPos + input.connectionWidth;

  this.inlinePath_ += Blockly.utils.svgPaths.moveTo(connectionRight, yPos) +
    Blockly.utils.svgPaths.lineOnAxis('v', connectionTop) +
    input.shape.pathDown +
    Blockly.utils.svgPaths.lineOnAxis('v', height - connectionBottom) +
    Blockly.utils.svgPaths.lineOnAxis('h', width - input.connectionWidth) +
    Blockly.utils.svgPaths.lineOnAxis('v', -height) +
    'z';

  this.positionInlineInputConnection_(input);
};

Blockly.console.Drawer.prototype.drawValueInput_ = function(row) {
  var input = row.getLastInput();
  this.positionExternalValueConnection_(row);

  var pathDown = (typeof input.shape.pathDown == "function") ?
    input.shape.pathDown(input.height) :
    input.shape.pathDown;

  var target = input.connection.targetBlock();
  var topOffset = 0;
  if (target) {
    topOffset = target.depth * this.constants_.MIN_TOP_HEIGHT;
    this.outlinePath_ +=
      Blockly.utils.svgPaths.lineOnAxis('v', topOffset);
  }

  this.outlinePath_ +=
    Blockly.utils.svgPaths.lineOnAxis('H', input.xPos + input.width) +
    pathDown +
    Blockly.utils.svgPaths.lineOnAxis('v',
        row.height - input.connectionHeight - topOffset);
};
