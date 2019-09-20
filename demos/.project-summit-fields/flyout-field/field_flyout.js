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

/**
 * @fileoverview Flyout that can be attached to a block.
 * @author bekawestberg@gmail.com
 */
'use strict';

goog.provide('Blockly.FieldFlyout');

goog.require('Blockly.Field');
goog.require('Blockly.BlockFlyout');


/*
 * WARNING: This field has some known bugs (and probably some unknown bugs).
 * It was created for demonstration purposes and should not be pulled into a
 * project without some refactoring.
 *
 * Known Bugs:
 * - Flyout looks weird when the callback does not return blocks.
 * - Scrollbars do not appear if workspace scale causes the content of the
 *  flyout to be larger than the size of the flyout.
 * - Blocks in the flyout do not properly change their size as the workspace
 *  scales.
 */

/**
 * Class for a non-editable flyout field.
 * @param {!string} flyoutKey The key used to register the custom flyout
 *    population function.
 * @param {Object=} opt_config An object containing options for customizing
 *    the field.
 * @constructor
 */
Blockly.FieldFlyout = function(flyoutKey, opt_config) {
  Blockly.FieldFlyout.superClass_.constructor.call(
    this, flyoutKey);
  this.configure_(opt_config);

  /*
   * In 2019 Q3 (when configure_ becomes part of the field API) this would
   * look like:
   *
   * Blockly.FieldFlyout.superClass_.constructor.call(
   *     this, flyoutKey, undefined, opt_config);
   */
};
goog.inherits(Blockly.FieldFlyout, Blockly.Field);

/**
 * Construct a FieldFlyout from a JSON arg object.
 * @param {!Object} options A JSON object with options (flyoutKey,
 *    foldoutText, sizingBehavior, minWidth, maxWidth).
 * @return {Blockly.FieldFlyout} The new field instance.
 */
Blockly.FieldFlyout.fromJson = function(options) {
  var field = new Blockly.FieldFlyout(options['flyoutKey'], options);
  return field;
};

/**
 * Editable fields usually show some sort of UI indicating they are
 * editable. This field should not.
 * @type {boolean}
 * @const
 */
Blockly.FieldFlyout.prototype.EDITABLE = false;

/**
 * Mouse cursor style when over the hot spot that initiates the editor.
 */
Blockly.FieldFlyout.prototype.CURSOR = 'default';


/**
 * Configures the non-value options of the field.
 * @param {Object} options An object with options (foldoutText,
 *    sizingBehavior, minWidth, maxWidth).
 * @protected
 */
Blockly.FieldFlyout.prototype.configure_ = function(options) {
  // In the 2019 Q3 release of blockly configure_ becomes part of the fields
  // API, but this is based on 2019 Q2.
  // Blockly.FieldFlyout.superClass_.configure_.call(this, options);
  if (!options) {
    return;
  }
  this.foldoutText_ = options['foldoutText'];
  this.sizingBehavior_ = options['sizingBehavior'];
  this.minWidth_ = options['minWidth'];
  this.maxWidth_ = options['maxWidth'];
};

/**
 * Create the on-block UI for this field.
 */
Blockly.FieldFlyout.prototype.initView = function() {
  this.createTextElement_();
  this.textContent_.nodeValue = this.foldoutText_;
  var span = Blockly.utils.dom.createSvgElement('tspan', {}, null);
  this.arrow_ = document.createTextNode('\u25B8');
  span.appendChild(this.arrow_);
  this.textElement_.insertBefore(span, this.textContent_);

  this.workspace_ = this.getSourceBlock().workspace;
  var flyoutOptions = {
    disabledPatternId: this.workspace_.options.disabledPatternId,
    parentWorkspace: this.workspace_,
    RTL: this.workspace_.RTL,
    sizingBehavior: this.sizingBehavior_,
    minWidth: this.minWidth_,
    maxWidth: this.maxWidth_
  };
  this.flyout_ = new Blockly.BlockFlyout(flyoutOptions);
  this.flyout_.setSourceBlock_(this.getSourceBlock());
  this.fieldGroup_.appendChild(this.flyout_.createDom('g'));
};

/**
 * Show the flyout when the foldout is clicked.
 * @protected
 */
Blockly.FieldFlyout.prototype.showEditor_ = function() {
  this.setFlyoutVisible(!this.isFlyoutVisible());
};

/**
 * Updates the on-block display and size of the field.
 * @protected
 */
Blockly.FieldFlyout.prototype.render_ = function() {
  var size = this.fieldGroup_.getBBox();
  if (this.flyout_.isVisible()) {
    var textSize = this.textElement_.getBBox();
    var vertMargins = 14;
    var horizMargins = 16;
    this.size_ = new goog.math.Size(
        Math.max(textSize.width, this.flyout_.getWidth() + horizMargins),
        size.height + vertMargins);
  } else {
    this.size_ = new goog.math.Size(size.width, size.height);
  }
};

/**
 * Changes the visibility of the flyout.
 * @param {boolean} visible Should the flyout be visible?
 */
Blockly.FieldFlyout.prototype.setFlyoutVisible = function(visible) {
  if (!this.flyout_.targetWorkspace_) {
    this.flyout_.init(this.workspace_);
    this.flyout_.svgGroup
  }

  if (visible) {
    this.arrow_.nodeValue = '\u25BE';
    this.flyout_.show(this.getValue());
  } else {
    this.arrow_.nodeValue = '\u25B8';
    this.flyout_.hide();
  }
  this.forceRerender();
};

/**
 * Is the flyout current visible?
 * @return {boolean}
 */
Blockly.FieldFlyout.prototype.isFlyoutVisible = function() {
  return this.flyout_.isVisible();
};

Blockly.Field.register('field_flyout', Blockly.FieldFlyout);
