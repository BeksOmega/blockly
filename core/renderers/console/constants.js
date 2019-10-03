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
 * @fileoverview An object that provides constants for rendering blocks in console
 * mode.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.provide('Blockly.console.ConstantProvider');

goog.require('Blockly.blockRendering.ConstantProvider');
goog.require('Blockly.utils.object');
goog.require('Blockly.utils.svgPaths');


/**
 * An object that provides constants for rendering blocks in console mode.
 * @constructor
 * @package
 * @extends {Blockly.blockRendering.ConstantProvider}
 */
Blockly.console.ConstantProvider = function() {
  Blockly.console.ConstantProvider.superClass_.constructor.call(this);

  this.GRID_UNIT = 4;

  /**
   * @override
   */
  this.CORNER_RADIUS = 0;

  /**
   * @override
   */
  this.NOTCH_WIDTH = 5 * this.GRID_UNIT;

  /**
   * @override
   */
  this.NOTCH_HEIGHT = 2 * this.GRID_UNIT;

  /**
   * @override
   */
  this.NOTCH_OFFSET_LEFT = 3 * this.GRID_UNIT;

  /**
   * @override
   */
  this.TAB_OFFSET_FROM_TOP = 0;

  this.MIN_BLOCK_HEIGHT = 0 * this.GRID_UNIT;

  this.TAB_WIDTH = 2 * this.GRID_UNIT;
  this.TAB_HEIGHT = 5 * this.GRID_UNIT;

  this.LARGE_PADDING = 2 * this.GRID_UNIT;
  this.MEDIUM_PADDING = 2 * this.GRID_UNIT;
};
Blockly.utils.object.inherits(Blockly.console.ConstantProvider,
    Blockly.blockRendering.ConstantProvider);

/**
 * @override
 */
Blockly.console.ConstantProvider.prototype.makeNotch = function() {
  var width = this.NOTCH_WIDTH;
  var height = this.NOTCH_HEIGHT;
  var halfTabWidth = width / 2;

  function makeMainPath(dir) {
    return (
      Blockly.utils.svgPaths.line([
        Blockly.utils.svgPaths.point(dir * halfTabWidth, height),
        Blockly.utils.svgPaths.point(dir * halfTabWidth, -height)
      ])
    );
  }

  var pathLeft = makeMainPath(1);
  var pathRight = makeMainPath(-1);

  return {
    width: width,
    height: height,
    pathLeft: pathLeft,
    pathRight: pathRight
  };
};

Blockly.console.ConstantProvider.prototype.makePuzzleTab = function() {
  var tabWidth = this.TAB_WIDTH;
  var tabHeight = this.TAB_HEIGHT;

  var halfTabWidth = tabWidth / 2;
  var thirdTabHeight = tabHeight / 3;

  function makeMainPath(blockHeight, dir) {
    var leftOverHeight = Math.max(blockHeight - tabHeight, 0);
    var halfLeftOverHeight = leftOverHeight / 2;
    console.trace();
    return Blockly.utils.svgPaths.line([
      Blockly.utils.svgPaths.point(0, dir * halfLeftOverHeight),
      Blockly.utils.svgPaths.point(-tabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * thirdTabHeight),
      Blockly.utils.svgPaths.point(halfTabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * thirdTabHeight),
      Blockly.utils.svgPaths.point(-halfTabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * thirdTabHeight),
      Blockly.utils.svgPaths.point(tabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * halfLeftOverHeight),
    ]);
  }


  return {
    width: tabWidth,
    height: /*0*/tabHeight,
    isDynamic: true,
    pathDown: function(height) {
      return makeMainPath(height, 1);
    },
    pathUp: function(height) {
      return makeMainPath(height, -1);
    },
  };
};

