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
  this.positionOutputConnection_();

  if (outputConnection) {
    var center = this.block_.centerline;
    var tabHeight = outputConnection.shape.height;
    var halfTabHeight = tabHeight / 2;
    var tabBottom = center + halfTabHeight;

    this.outlinePath_ +=
      Blockly.utils.svgPaths.lineOnAxis('V', tabBottom) +
      outputConnection.shape.pathUp;
  }

  this.outlinePath_ += 'z';
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

  this.positionInlineInputConnection_(input);
};
