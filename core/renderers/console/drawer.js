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

/**
 * Add steps for the left side of the block, which may include an output
 * connection
 * @protected
 */
Blockly.console.Drawer.prototype.drawLeft_ = function() {
  var outputConnection = this.info_.outputConnection;
  this.positionOutputConnection_();

  if (outputConnection) {
    var tabTop = (this.block_.depth + 1) * this.constants_.MIN_TOP_HEIGHT;
    var tabBottom = tabTop + outputConnection.height;
    var pathUp = outputConnection.shape.pathUp;
    // Draw a line up to the bottom of the tab.
    this.outlinePath_ +=
        Blockly.utils.svgPaths.lineOnAxis('V', tabBottom) +
        pathUp;
  }
  // Close off the path.  This draws a vertical line up to the start of the
  // block's path, which may be either a rounded or a sharp corner.
  this.outlinePath_ += 'z';
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
