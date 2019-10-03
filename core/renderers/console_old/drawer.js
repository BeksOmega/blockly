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
 * @fileoverview consoleOld renderer.
 */
'use strict';

goog.provide('Blockly.consoleOld.Drawer');

goog.require('Blockly.blockRendering.ConstantProvider');
goog.require('Blockly.blockRendering.Drawer');
goog.require('Blockly.blockRendering.Types');
goog.require('Blockly.utils.object');
goog.require('Blockly.consoleOld.RenderInfo');


/**
 * An object that draws a block based on the given rendering information.
 * @param {!Blockly.BlockSvg} block The block to render.
 * @param {!Blockly.consoleOld.RenderInfo} info An object containing all
 *   information needed to render this block.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.Drawer}
 */
Blockly.consoleOld.Drawer = function(block, info) {
  Blockly.consoleOld.Drawer.superClass_.constructor.call(this, block, info);
};
Blockly.utils.object.inherits(Blockly.consoleOld.Drawer,
    Blockly.blockRendering.Drawer);

/**
 * @override
 */
Blockly.consoleOld.Drawer.prototype.drawInlineInput_ = function(input) {
  // Don't draw an inline input.
  this.positionInlineInputConnection_(input);
};
