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
 * @fileoverview baseline rendering drawer.
 */
'use strict';

goog.provide('Blockly.baseline.Drawer');

goog.require('Blockly.blockRendering.Drawer');
goog.require('Blockly.utils.object');
goog.require('Blockly.baseline.RenderInfo');


/**
 * An object that draws a block based on the given rendering information.
 * @param {!Blockly.BlockSvg} block The block to render.
 * @param {!Blockly.baseline.RenderInfo} info An object containing all
 *   information needed to render this block.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.Drawer}
 */
Blockly.baseline.Drawer = function(block, info) {
  Blockly.baseline.Drawer.superClass_.constructor.call(this, block, info);
};
Blockly.utils.object.inherits(Blockly.baseline.Drawer,
    Blockly.blockRendering.Drawer);

/**
 * Add steps for the left side of the block, which may include an output
 * connection
 * @protected
 */
Blockly.baseline.Drawer.prototype.drawLeft_ = function() {
  var outputConnection = this.info_.outputConnection;

  if (outputConnection) {
    var center = this.block_.centerline;
    var tabHeight = outputConnection.shape.height;
    var halfTabHeight = tabHeight / 2;
    var tabBottom = center + halfTabHeight;

    this.positionOutputConnection_(outputConnection, tabBottom);
    this.outlinePath_ +=
      Blockly.utils.svgPaths.lineOnAxis('V', tabBottom) +
      outputConnection.shape.pathUp;
  }

  this.outlinePath_ += 'z';
};

/**
 * Position the output connection on a block.
 * @protected
 */
Blockly.baseline.Drawer.prototype.positionOutputConnection_ =
  function(outputConnection, connectionBottom) {
    var x = this.info_.startX;
    var connX = this.info_.RTL ? -x : x;
    var connY = connectionBottom - outputConnection.shape.height;
    this.block_.outputConnection.setOffsetInBlock(connX, connY);
  };

/**
 * Add steps for an inline input.
 * @param {!Blockly.blockRendering.InlineInput} input The information about the
 * input to render.
 * @protected
 */
Blockly.baseline.Drawer.prototype.drawInlineInput_ = function(input) {
  var width = input.width;
  var height = input.height;
  var yPos = input.centerline - height / 2;


  var connectionTop = this.constants_.EMPTY_INLINE_INPUT_TAB_OFFSET_FROM_TOP;
  var target = input.input.connection.targetBlock();
  if (target) {
    connectionTop = target.centerline - input.connectionHeight / 2;
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

  this.positionInlineInputConnection_(input, connectionTop);
};

/**
 * Position the connection on an inline value input.
 * @param {Blockly.blockRendering.InlineInput} input The information about
 * the input that the connection is on.
 * @param {number} topOffset The vertical offset the connection has from the
 *    top of the row.
 * @protected
 */
Blockly.baseline.Drawer.prototype.positionInlineInputConnection_ =
  function(input, topOffset) {
    if (!input.connection) {
      return;
    }
    var top = input.centerline - input.height / 2;
    var connY = top + topOffset;
    // xPos already contains info about startX
    var connX = input.xPos + input.connectionWidth;
    if (this.info_.RTL) {
      connX *= -1;
    }
    input.connection.setOffsetInBlock(connX, connY);
  };

/**
 * Add steps for an external value input, rendered as a notch in the side
 * of the block.
 * @param {!Blockly.blockRendering.Row} row The row that this input
 *     belongs to.
 * @protected
 */
Blockly.baseline.Drawer.prototype.drawValueInput_ = function(row) {
  var input = row.getLastInput();

  var pathDown = (typeof input.shape.pathDown == "function") ?
    input.shape.pathDown(input.height) :
    input.shape.pathDown;

  var target = input.connection.targetBlock();
  var topOffset = 0;
  if (target) {
    topOffset = target.centerline - input.connectionHeight / 2;
    this.outlinePath_ +=
      Blockly.utils.svgPaths.lineOnAxis('v', topOffset);
  }

  this.positionExternalValueConnection_(row, input, topOffset);

  this.outlinePath_ +=
    Blockly.utils.svgPaths.lineOnAxis(
        'H', input.xPos + input.width) +
    pathDown +
    Blockly.utils.svgPaths.lineOnAxis(
        'v', row.height - input.connectionHeight - topOffset);
};

/**
 * Position the connection on an external value input.
 * @param {!Blockly.blockRendering.Row} row The row that the connection is on.
 * @param {!Blockly.Input} input The input the connection belongs to.
 * @param {number} topOffset The vertical offset the connection has from the
 *    top of the row.
 * @protected
 */
Blockly.baseline.Drawer.prototype.positionExternalValueConnection_ =
  function(row, input, topOffset) {
    if (!input.connection) {
      return;
    }
    var connY = row.yPos + topOffset;
    var connX = row.xPos + row.width;
    if (this.info_.RTL) {
      connX *= -1;
    }
    input.connection.setOffsetInBlock(connX, connY);
  };

/**
 * Position the next connection on a block.
 * @protected
 */
Blockly.blockRendering.Drawer.prototype.positionNextConnection_ = function() {
  var bottomRow = this.info_.bottomRow;

  if (bottomRow.connection) {
    var connInfo = bottomRow.connection;
    var x = connInfo.xPos; // Already contains info about startX
    var connX = (this.info_.RTL ? -x : x);
    connInfo.connectionModel.setOffsetInBlock(connX, bottomRow.baseline);
  }
};
