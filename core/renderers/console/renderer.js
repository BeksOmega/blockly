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
 * @fileoverview console renderer.
 */
'use strict';

goog.provide('Blockly.console.Renderer');

goog.require('Blockly.blockRendering');
goog.require('Blockly.blockRendering.Renderer');
goog.require('Blockly.utils.object');
goog.require('Blockly.console.ConstantProvider');
goog.require('Blockly.console.Drawer');
goog.require('Blockly.console.RenderInfo');
goog.require('Blockly.console.PathObject');


/**
 * The console renderer.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.Renderer}
 */
Blockly.console.Renderer = function() {
  Blockly.console.Renderer.superClass_.constructor.call(this);
  this.constants_ = null;
};
Blockly.utils.object.inherits(Blockly.console.Renderer,
    Blockly.blockRendering.Renderer);


/**
 * Create a new instance of the renderer's constant provider.
 * @return {!Blockly.console.ConstantProvider} The constant provider.
 * @protected
 * @override
 */
Blockly.console.Renderer.prototype.makeConstants_ = function() {
  if (!this.constants_) {
    this.constants_ = new Blockly.console.ConstantProvider()
  }
  return this.constants_;
};

/**
 * Create a new instance of the renderer's render info object.
 * @param {!Blockly.BlockSvg} block The block to measure.
 * @return {!Blockly.console.RenderInfo} The render info object.
 * @protected
 * @override
 */
Blockly.console.Renderer.prototype.makeRenderInfo_ = function(block) {
  block.depth = 0;
  return new Blockly.console.RenderInfo(this, block);
};

/**
 * Create a new instance of the renderer's drawer.
 * @param {!Blockly.BlockSvg} block The block to render.
 * @param {!Blockly.blockRendering.RenderInfo} info An object containing all
 *   information needed to render this block.
 * @return {!Blockly.console.Drawer} The drawer.
 * @protected
 * @override
 */
Blockly.console.Renderer.prototype.makeDrawer_ = function(block, info) {
  return new Blockly.console.Drawer(block,
      /** @type {!Blockly.console.RenderInfo} */ (info));
};

Blockly.console.Renderer.prototype.makePathObject = function(root, block) {
  return new Blockly.console.PathObject(root, block, this.makeConstants_());
};

Blockly.blockRendering.register('console', Blockly.console.Renderer);
