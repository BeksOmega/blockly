/**
 * @license
 * Blockly User Summit 2019 Fields Demos
 *
 * Copyright 2019 Beka Westberg
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

/* Code below is based on code from Blockly:
 * https://github.com/google/blockly
 */

'use strict';

goog.provide('Blockly.BlockFlyout');

goog.require('Blockly.Block');
goog.require('Blockly.HorizontalFlyout');
goog.require('Blockly.FlyoutButton');
goog.require('Blockly.utils');
goog.require('Blockly.utils.Rect');


/**
 * Class for a flyout that lives on a block.
 * @param {!Object} workspaceOptions Dictionary of options for the workspace.
 * @extends {Blockly.Flyout}
 * @constructor
 */
Blockly.BlockFlyout = function(workspaceOptions) {
  workspaceOptions.getMetrics = this.getMetrics_.bind(this);
  workspaceOptions.setMetrics = this.setMetrics_.bind(this);

  Blockly.BlockFlyout.superClass_.constructor.call(this, workspaceOptions);
  /**
   * Flyout should be laid out horizontally.
   * @type {boolean}
   * @private
   */
  this.horizontalLayout_ = true;

  this.sizingBehavior_ = workspaceOptions['sizingBehavior'] || this.sizingBehavior_;
  this.minWidth_ = workspaceOptions['minWidth'] || this.minWidth_;
  this.maxWidth_ = workspaceOptions['maxWidth'] || this.maxWidth_;
};
goog.inherits(Blockly.BlockFlyout, Blockly.HorizontalFlyout);

/**
 * Types of sizing behavior.
 * @type {{FIT_PARENT: string, FIT_CONTENT: string}}
 * @const
 */
Blockly.BlockFlyout.SIZING_BEHAVIOR = {
  FIT_PARENT: 'fitParent',
  FIT_CONTENT: 'fitContent'
};

/**
 * Height of the foldout.
 * @type {number}
 */
Blockly.BlockFlyout.FOLDOUT_HEIGHT = 20;

/**
 * Should this flyout close when a block is dragged from it?
 * @type {boolean}
 */
Blockly.BlockFlyout.prototype.autoClose = false;

/**
 * The sizing behavior for this flyout.
 * @type {string}
 * @private
 */
Blockly.BlockFlyout.prototype.sizingBehavior_ =
    Blockly.BlockFlyout.SIZING_BEHAVIOR.FIT_CONTENT;

/**
 * The minimum width of this flyout.
 * @type {number}
 * @private
 */
Blockly.BlockFlyout.prototype.minWidth_ = 0;

/**
 * The maximum width of this flyout.
 * @type {number}
 * @private
 */
Blockly.BlockFlyout.prototype.maxWidth_ = 1000;

/**
 * Return an object with all the metrics required to size scrollbars for the
 * flyout.  The following properties are computed:
 * .viewHeight: Height of the visible rectangle,
 * .viewWidth: Width of the visible rectangle,
 * .contentHeight: Height of the contents,
 * .contentWidth: Width of the contents,
 * .viewTop: Offset of top edge of visible rectangle from parent,
 * .contentTop: Offset of the top-most content from the y=0 coordinate,
 * .absoluteTop: Top-edge of view.
 * .viewLeft: Offset of the left edge of visible rectangle from parent,
 * .contentLeft: Offset of the left-most content from the x=0 coordinate,
 * .absoluteLeft: Left-edge of view.
 * @return {Object} Contains size and position metrics of the flyout.
 * @private
 */
Blockly.BlockFlyout.prototype.getMetrics_ = function() {
  if (!this.isVisible()) {
    // Flyout is hidden.
    return null;
  }

  try {
    var optionBox = this.workspace_.getCanvas().getBBox();
  } catch (e) {
    // Firefox has trouble with hidden elements (Bug 528969).
    var optionBox = {height: 0, y: 0, width: 0, x: 0};
  }

  var viewHeight = this.height_;
  var viewWidth = this.width_ + 2 * this.MARGIN;

  var contentHeight, contentWidth;
  if (this.sizingBehavior_ == Blockly.BlockFlyout.SIZING_BEHAVIOR.FIT_CONTENT) {
    contentHeight = viewHeight;
    // B/c resizeViewHorizontal in scrollbar.
    contentWidth = viewWidth - 1;
  } else {
    var contentHeight = (optionBox.height + 2 * this.MARGIN)
      * this.workspace_.scale;
    var contentWidth = (optionBox.width + this.GAP_X + 2 * this.MARGIN)
      * this.workspace_.scale;
  }

  var metrics = {
    viewHeight: viewHeight,
    viewWidth: viewWidth,
    contentHeight: contentHeight,
    contentWidth: contentWidth,
    viewTop: -this.workspace_.scrollY,
    viewLeft: -this.workspace_.scrollX,
    contentTop: 0,
    contentLeft: 0,
    absoluteTop: this.SCROLLBAR_PADDING,
    absoluteLeft: this.SCROLLBAR_PADDING
  };
  return metrics;
};

/**
 * Sets the translation of the flyout to match the scrollbars.
 * @param {!Object} xyRatio Contains a y property which is a float
 *     between 0 and 1 specifying the degree of scrolling and a
 *     similar x property.
 * @private
 */
Blockly.BlockFlyout.prototype.setMetrics_ = function(xyRatio) {
  var metrics = this.getMetrics_();
  // This is a fix to an apparent race condition.
  if (!metrics) {
    return;
  }

  if (typeof xyRatio.x == 'number') {
    this.workspace_.scrollX = -metrics.contentWidth * xyRatio.x;
  }

  this.workspace_.translate(this.workspace_.scrollX + metrics.absoluteLeft,
    this.workspace_.scrollY + metrics.absoluteTop);
};

/**
 * Create the DOM for the flyout.
 * @param {string} tagName The type of tag to put the flyout in. This
 *     should be <svg> or <g>.
 * @return {!Element} The flyout's SVG group.
 */
Blockly.BlockFlyout.prototype.createDom = function(tagName) {
  Blockly.BlockFlyout.superClass_.createDom.call(this, tagName);
  var id =  'flyoutClip' + Blockly.utils.genUid().replace(/([\(\)])/g, '');
  var defs = Blockly.utils.dom.createSvgElement(
    'defs', {}, this.svgGroup_);
  var clipPathParent = Blockly.utils.dom.createSvgElement(
    'clipPath', {'id': id}, defs);
  this.svgClipPath_ = Blockly.utils.dom.createSvgElement(
      'path', {}, clipPathParent);
  this.svgGroup_.setAttribute('clip-path', 'url(#' + id + ')');
  return this.svgGroup_;
};

/**
 * Initializes the flyout.
 * @param {!Blockly.Workspace} targetWorkspace The workspace in which to create
 *     new blocks.
 */
Blockly.BlockFlyout.prototype.init = function(targetWorkspace) {
  Blockly.BlockFlyout.superClass_.init.call(this, targetWorkspace);

  // Change scrollbar to 'g' node.
  var oldOuterSvg = this.scrollbar_.outerSvg_;
  var newOuterSvg = Blockly.utils.dom.createSvgElement('g', {}, null);
  while (oldOuterSvg.firstChild) {
    newOuterSvg.appendChild(oldOuterSvg.firstChild);
  }
  for(var i = oldOuterSvg.attributes.length - 1; i >=0; i--) {
    newOuterSvg.attributes.setNamedItem(oldOuterSvg.attributes[i].cloneNode());
  }
  this.scrollbar_.outerSvg_ = newOuterSvg;

  this.svgGroup_.appendChild(this.scrollbar_.outerSvg_);
};

/**
 * Compute the height and width of the flyout. Position mat under each block.
 * For RTL: Lay out the blocks right-aligned.
 * @private
 */
Blockly.BlockFlyout.prototype.reflowInternal_ = function() {
  // Note: No need to apply scale, as we already exist in the scaled space.

  this.height_ = this.width_ = 0;
  var blocks = this.workspace_.getTopBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    var blockSize = block.getHeightWidth();
    this.updateHeight_(blockSize);
    this.updateWidth_(blockSize);
    if (block.flyoutRect_) {
      this.moveRectToBlock_(block.flyoutRect_, block);
    }
  }

  this.height_ += this.MARGIN * 2;
  /*if (this.scrollbar_.containerVisible_) {
    flyoutHeight += Blockly.Scrollbar.scrollbarThickness;
  }*/

  this.setBackgroundPath_(this.width_, this.height_);
  this.position();
};

/**
 * Update the flyout's height based on the height of a block in the flyout.
 * Used when reflowing.
 * @param {!Object} blockSize An object containing the height and width of a
 *    block.
 * @private
 */
Blockly.BlockFlyout.prototype.updateHeight_ = function(blockSize) {
  this.height_ = Math.max(this.height_, blockSize.height);
};

/**
 * Update the flyout's width based on teh width of a block in the flyout.
 * Used when reflowing.
 * @param {!Object} blockSize An object containing the height and width of a
 *    block.
 * @private
 */
Blockly.BlockFlyout.prototype.updateWidth_ = function(blockSize) {
  if (this.sizingBehavior_ == Blockly.BlockFlyout.SIZING_BEHAVIOR.FIT_CONTENT) {
    this.width_ += blockSize.width;
    this.width_ += this.GAP_X;
  } else if (this.width_ == 0) {
    var margin = 36;
    this.width_ = this.sourceBlock_.getHeightWidth().width - margin;
  }
};

/**
 * Move the flyout under the foldout.
 */
Blockly.BlockFlyout.prototype.position = function() {
  if (!this.isVisible()) {
    return;
  }
  this.positionAt_(
    this.width_,
    this.height_,
    0,
    Blockly.BlockFlyout.FOLDOUT_HEIGHT);
};

/**
 * Create and set the path for the visible boundaries of the flyout.
 * @param {number} width The width of the flyout, not including the
 *     rounded corners.
 * @param {number} height The height of the flyout, not including
 *     rounded corners.
 * @private
 */
Blockly.BlockFlyout.prototype.setBackgroundPath_ = function(width, height) {
  var atTop = this.toolboxPosition_ == Blockly.TOOLBOX_AT_TOP;
  // Start at top left.
  var path = ['M 0,' + (atTop ? 0 : this.CORNER_RADIUS)];

  // Top.
  path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1,
    this.CORNER_RADIUS, -this.CORNER_RADIUS);
  path.push('h', width);
  // Right.
  path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1,
    this.CORNER_RADIUS, this.CORNER_RADIUS);
  path.push('v', height);
  // Bottom.
  path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1,
    -this.CORNER_RADIUS, this.CORNER_RADIUS);
  path.push('h', -1 * width);
  // Left.
  path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1,
    -this.CORNER_RADIUS, -this.CORNER_RADIUS);
  path.push('z');

  var joinedPath = path.join(' ');
  this.svgClipPath_.setAttribute('d', joinedPath);
  this.svgBackground_.setAttribute('d', joinedPath);
};

/**
 * Set the block that this flyout lives on.
 * @param {!Blockly.Block} block The block the flyout lives on.
 * @private
 */
Blockly.BlockFlyout.prototype.setSourceBlock_ = function(block) {
  this.sourceBlock_ = block;
};
