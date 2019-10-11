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
 * @fileoverview An object that provides constants for rendering blocks in the
 * console renderer.
 */
'use strict';

goog.provide('Blockly.console.ConstantProvider');

goog.require('Blockly.blockRendering.ConstantProvider');
goog.require('Blockly.utils.object');


/**
 * An object that provides constants for rendering blocks in the sample.
 * @constructor
 * @package
 * @extends {Blockly.blockRendering.ConstantProvider}
 */
Blockly.console.ConstantProvider = function() {
  Blockly.console.ConstantProvider.superClass_.constructor.call(this);

  this.GRID_UNIT = 4;

  /**
   * Adjust the notch width and height here.
   */
  this.NOTCH_WIDTH = 4 * this.GRID_UNIT;
  this.NOTCH_HEIGHT = 2 * this.GRID_UNIT;

  /**
   * Adjust the left corner radius here.
   */
  this.CORNER_RADIUS = 0;

  /**
   * Adjust the tab width and height here.
   */
  this.TAB_HEIGHT = 4 * this.GRID_UNIT;
  this.TAB_WIDTH = 2 * this.GRID_UNIT;


  this.NOTCH_OFFSET_LEFT = 3 * this.GRID_UNIT;

  this.MIN_TOP_HEIGHT = this.GRID_UNIT;
  this.MIN_BOTTOM_HEIGHT = this.GRID_UNIT;
  this.MIN_INPUT_HEIGHT = this.TAB_HEIGHT;

  this.TAB_OFFSET_FROM_TOP = this.GRID_UNIT;

  this.EMPTY_INLINE_INPUT_HEIGHT =
      this.MIN_TOP_HEIGHT +
      this.MIN_INPUT_HEIGHT +
      this.MIN_BOTTOM_HEIGHT;

  this.TOP_BORDER_WIDTH = 2;
  this.BOTTOM_BORDER_WIDTH = 2;

  /*this.TOP_BORDER_WIDTH = this.GRID_UNIT / 2;
  this.BOTTOM_BORDER_WIDTH = this.GRID_UNIT;*/

  this.THINNER_BORDER_OFFSET = this.TOP_BORDER_WIDTH / 2;
  this.THICKER_BORDER_OFFSET = this.BOTTOM_BORDER_WIDTH / 2;
  this.TOTAL_BORDER_OFFSET = this.THINNER_BORDER_OFFSET + this.THICKER_BORDER_OFFSET;

  this.STATEMENT_SPACING = 5 * this.GRID_UNIT;
};
Blockly.utils.object.inherits(Blockly.console.ConstantProvider,
    Blockly.blockRendering.ConstantProvider);


/**
* Pointy notch.
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

/**
* Pluggy tab.
* @override
*/
Blockly.console.ConstantProvider.prototype.makePuzzleTab = function() {
  var tabWidth = this.TAB_WIDTH;
  var tabHeight = this.TAB_HEIGHT;

  var halfTabWidth = tabWidth / 2;
  var thirdTabHeight = tabHeight / 3;

  function makeMainPath(dir) {
    return Blockly.utils.svgPaths.line([
      Blockly.utils.svgPaths.point(-tabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * thirdTabHeight),
      Blockly.utils.svgPaths.point(halfTabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * thirdTabHeight),
      Blockly.utils.svgPaths.point(-halfTabWidth, 0),
      Blockly.utils.svgPaths.point(0, dir * thirdTabHeight),
      Blockly.utils.svgPaths.point(tabWidth, 0),
    ]);
  }

  return {
    width: tabWidth,
    height: tabHeight,
    // I think this only applies to zelos.
    isDynamic: true,
    pathDown: makeMainPath(1),
    pathUp: makeMainPath(-1)
  };
};
