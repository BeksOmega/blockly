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
 * @fileoverview baseline renderer.
 */
'use strict';

goog.provide('Blockly.baseline.Renderer');

goog.require('Blockly.blockRendering');
goog.require('Blockly.blockRendering.Renderer');
goog.require('Blockly.utils.object');
goog.require('Blockly.baseline.ConstantProvider');
goog.require('Blockly.baseline.Drawer');
goog.require('Blockly.baseline.RenderInfo');


/**
 * The baseline renderer.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.Renderer}
 */
Blockly.baseline.Renderer = function() {
  Blockly.baseline.Renderer.superClass_.constructor.call(this);
};
Blockly.utils.object.inherits(Blockly.baseline.Renderer,
    Blockly.blockRendering.Renderer);

/**
 * Create a new instance of the renderer's constant provider.
 * @return {!Blockly.baseline.ConstantProvider} The constant provider.
 * @protected
 * @override
 */
Blockly.baseline.Renderer.prototype.makeConstants_ = function() {
  return new Blockly.baseline.ConstantProvider();
};

/**
 * Create a new instance of the renderer's render info object.
 * @param {!Blockly.BlockSvg} block The block to measure.
 * @return {!Blockly.baseline.RenderInfo} The render info object.
 * @protected
 * @override
 */
Blockly.baseline.Renderer.prototype.makeRenderInfo_ = function(block) {
  return new Blockly.baseline.RenderInfo(this, block);
};

/**
 * Create a new instance of the renderer's drawer.
 * @param {!Blockly.BlockSvg} block The block to render.
 * @param {!Blockly.blockRendering.RenderInfo} info An object containing all
 *   information needed to render this block.
 * @return {!Blockly.baseline.Drawer} The drawer.
 * @protected
 * @override
 */
Blockly.baseline.Renderer.prototype.makeDrawer_ = function(block, info) {
  return new Blockly.baseline.Drawer(block,
      /** @type {!Blockly.baseline.RenderInfo} */ (info));
};

Blockly.blockRendering.register('baseline', Blockly.baseline.Renderer);
