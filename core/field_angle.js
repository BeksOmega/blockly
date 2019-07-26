/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
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
 * @fileoverview Angle input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldAngle');

goog.require('Blockly.DropDownDiv');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.utils');

goog.require('goog.userAgent');


/**
 * Class for an editable angle field.
 * @param {(string|number)=} opt_value The initial content of the field. The
 *     value should cast to a number, and if it does not, '0' will be used.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.FieldTextInput}
 * @constructor
 */
Blockly.FieldAngle = function(opt_value, opt_validator) {
  // Add degree symbol: '360°' (LTR) or '°360' (RTL)
  this.symbol_ = Blockly.utils.createSvgElement('tspan', {}, null);
  this.symbol_.appendChild(document.createTextNode('\u00B0'));

  opt_value = (opt_value && !isNaN(opt_value)) ? String(opt_value) : '0';
  Blockly.FieldAngle.superClass_.constructor.call(
      this, opt_value, opt_validator);
};
goog.inherits(Blockly.FieldAngle, Blockly.FieldTextInput);

/**
 * Construct a FieldAngle from a JSON arg object.
 * @param {!Object} options A JSON object with options (angle).
 * @return {!Blockly.FieldAngle} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldAngle.fromJson = function(options) {
  var field = new Blockly.FieldAngle(options['angle']);

  var clockwise = null;
  var offset = null;
  var wrap = null;
  var round = null;

  var mode = options['mode'];
  switch (mode) {
    case 'compass':
      clockwise = true;
      offset = 90;
      break;
    case 'protractor':
      // This is the default mode, so we could do nothing. But just to
      // future-proof we'll set it anyway.
      clockwise = false;
      offset = 0;
      break;
  }

  // Allow individual settings to override the mode setting.
  if (typeof options['clockwise'] == 'boolean') {
    clockwise = options['clockwise'];
  }
  if (typeof options['offset'] == 'number') {
    offset = options['offset'];
  }
  if (typeof options['wrap'] == 'number') {
    wrap = options['wrap'];
  }
  if (typeof options['round'] == 'number') {
    round = options['round'];
  }

  field.setClockwise((clockwise));
  field.setOffset(offset);
  field.setWrap(wrap);
  field.setRound(round);

  return field;
};

/**
 * Half the width of protractor image.
 */
Blockly.FieldAngle.HALF = 100 / 2;

/**
 * Radius of protractor circle.  Slightly smaller than protractor size since
 * otherwise SVG crops off half the border at the edges.
 */
Blockly.FieldAngle.RADIUS = Blockly.FieldAngle.HALF - 1;

/* The following two settings work together to set the behaviour of the angle
 * picker.  While many combinations are possible, two modes are typical:
 * Math mode.
 *   0 deg is right, 90 is up.  This is the style used by protractors.
 *   Blockly.FieldAngle.CLOCKWISE = false;
 *   Blockly.FieldAngle.OFFSET = 0;
 * Compass mode.
 *   0 deg is up, 90 is right.  This is the style used by maps.
 *   Blockly.FieldAngle.CLOCKWISE = true;
 *   Blockly.FieldAngle.OFFSET = 90;
 */

/**
 * Angle increases clockwise (true) or counterclockwise (false).
 */
Blockly.FieldAngle.CLOCKWISE = false;

/**
 * Offset the location of 0 degrees (and all angles) by a constant.
 * Usually either 0 (0 = right) or 90 (0 = up).
 */
Blockly.FieldAngle.OFFSET = 0;

/**
 * Maximum allowed angle before wrapping.
 * Usually either 360 (for 0 to 359.9) or 180 (for -179.9 to 180).
 */
Blockly.FieldAngle.WRAP = 360;

/**
 * Round angles to the nearest 15 degrees when using mouse.
 * Set to 0 to disable rounding.
 */
Blockly.FieldAngle.ROUND = 15;


/**
 * The clockwise property used by this field. If null, use the global property.
 * @type {?boolean}
 * @private
 */
Blockly.FieldAngle.prototype.clockwise_ = null;

/**
 * The offset property used by this field. If null, use the global property.
 * @type {?number}
 * @private
 */
Blockly.FieldAngle.prototype.offset_ = null;

/**
 * The wrap property used by this field. If null, use the global property.
 * @type {?number}
 * @private
 */
Blockly.FieldAngle.prototype.wrap_ = null;

/**
 * The round property used by this field. If null, use the global property.
 * @type {?number}
 * @private
 */
Blockly.FieldAngle.prototype.round_ = null;

/**
 * Adds degree symbol and recalculates width.
 * Saves the computed width in a property.
 * @private
 */
Blockly.FieldAngle.prototype.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0;
    return;
  }

  // Update textElement.
  this.textElement_.textContent = this.getDisplayText_();

  // Insert degree symbol.
  if (this.sourceBlock_.RTL) {
    this.textElement_.insertBefore(this.symbol_, this.textElement_.firstChild);
  } else {
    this.textElement_.appendChild(this.symbol_);
  }
  this.updateWidth();
};

/**
 * Clean up this FieldAngle, as well as the inherited FieldTextInput.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldAngle.prototype.dispose_ = function() {
  var thisField = this;
  return function() {
    Blockly.FieldAngle.superClass_.dispose_.call(thisField)();
    thisField.gauge_ = null;
    if (thisField.clickWrapper_) {
      Blockly.unbindEvent_(thisField.clickWrapper_);
    }
    if (thisField.moveWrapper1_) {
      Blockly.unbindEvent_(thisField.moveWrapper1_);
    }
    if (thisField.moveWrapper2_) {
      Blockly.unbindEvent_(thisField.moveWrapper2_);
    }
  };
};

/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
Blockly.FieldAngle.prototype.showEditor_ = function() {
  var noFocus =
      goog.userAgent.MOBILE || goog.userAgent.ANDROID || goog.userAgent.IPAD;
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  Blockly.FieldAngle.superClass_.showEditor_.call(this, noFocus);

  // If there is an existing drop-down someone else owns, hide it immediately and clear it.
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();

  // Build the SVG DOM.
  var svg = Blockly.utils.createSvgElement('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'height': (Blockly.FieldAngle.HALF * 2) + 'px',
    'width': (Blockly.FieldAngle.HALF * 2) + 'px'
  }, div);
  var circle = Blockly.utils.createSvgElement('circle', {
    'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
    'r': Blockly.FieldAngle.RADIUS,
    'class': 'blocklyAngleCircle'
  }, svg);
  this.gauge_ = Blockly.utils.createSvgElement('path',
      {'class': 'blocklyAngleGauge'}, svg);
  this.line_ = Blockly.utils.createSvgElement('line', {
    'x1': Blockly.FieldAngle.HALF,
    'y1': Blockly.FieldAngle.HALF,
    'class': 'blocklyAngleLine'
  }, svg);
  // Draw markers around the edge.
  for (var angle = 0; angle < 360; angle += 15) {
    Blockly.utils.createSvgElement('line', {
      'x1': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS,
      'y1': Blockly.FieldAngle.HALF,
      'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS -
          (angle % 45 == 0 ? 10 : 5),
      'y2': Blockly.FieldAngle.HALF,
      'class': 'blocklyAngleMarks',
      'transform': 'rotate(' + angle + ',' +
          Blockly.FieldAngle.HALF + ',' + Blockly.FieldAngle.HALF + ')'
    }, svg);
  }


  Blockly.DropDownDiv.setColour(this.sourceBlock_.getColour(),
      this.sourceBlock_.getColour());
  Blockly.DropDownDiv.showPositionedByField(this);
  // The angle picker is different from other fields in that it updates on
  // mousemove even if it's not in the middle of a drag.  In future we may
  // change this behaviour.  For now, using bindEvent_ instead of
  // bindEventWithChecks_ allows it to work without a mousedown/touchstart.
  this.clickWrapper_ =
      Blockly.bindEvent_(svg, 'click', this, this.hide_.bind(this));
  this.moveWrapper1_ =
      Blockly.bindEvent_(circle, 'mousemove', this, this.onMouseMove);
  this.moveWrapper2_ =
      Blockly.bindEvent_(this.gauge_, 'mousemove', this, this.onMouseMove);
  this.updateGraph_();
};

/**
 * Hide the editor and unbind event listeners.
 * @private
 */
Blockly.FieldAngle.prototype.hide_ = function() {
  Blockly.unbindEvent_(this.moveWrapper1_);
  Blockly.unbindEvent_(this.moveWrapper2_);
  Blockly.unbindEvent_(this.clickWrapper_);
  Blockly.DropDownDiv.hideIfOwner(this);
  Blockly.WidgetDiv.hide();
};

/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldAngle.prototype.onMouseMove = function(e) {
  var bBox = this.gauge_.ownerSVGElement.getBoundingClientRect();
  var dx = e.clientX - bBox.left - Blockly.FieldAngle.HALF;
  var dy = e.clientY - bBox.top - Blockly.FieldAngle.HALF;
  var angle = Math.atan(-dy / dx);
  if (isNaN(angle)) {
    // This shouldn't happen, but let's not let this error propagate further.
    return;
  }
  angle = Blockly.utils.toDegrees(angle);
  // 0: East, 90: North, 180: West, 270: South.
  if (dx < 0) {
    angle += 180;
  } else if (dy > 0) {
    angle += 360;
  }

  // Do offsetting.
  var offset = this.getOffset();
  if (this.getClockwise()) {
    angle = offset + 360 - angle;
  } else {
    angle = 360 - (offset - angle);
  }
  if (angle > 360) {
    angle -= 360;
  }

  // Do rounding.
  var round = this.getRound();
  if (round) {
    angle = Math.round(angle / round) * round;
  }

  // Do wrapping.
  if (angle > this.getWrap()) {
    angle -= 360;
  }

  angle = this.callValidator(angle);
  Blockly.FieldTextInput.htmlInput_.value = angle;
  this.setValue(angle);
  this.validate_();
  this.resizeEditor_();
};

/**
 * Insert a degree symbol.
 * @param {?string} text New text.
 */
Blockly.FieldAngle.prototype.setText = function(text) {
  Blockly.FieldAngle.superClass_.setText.call(this, text);
  if (!this.textElement_) {
    // Not rendered yet.
    return;
  }
  this.updateGraph_();
  // Cached width is obsolete.  Clear it.
  this.size_.width = 0;
};

/**
 * Redraw the graph with the current angle.
 * @private
 */
Blockly.FieldAngle.prototype.updateGraph_ = function() {
  if (!this.gauge_) {
    return;
  }
  var clockwise = this.getClockwise();
  var offset = this.getOffset();

  var angleDegrees = Number(this.getText()) + offset;
  angleDegrees %= 360;
  var angleRadians = Blockly.utils.toRadians(angleDegrees);
  var path = ['M ', Blockly.FieldAngle.HALF, ',', Blockly.FieldAngle.HALF];
  var x2 = Blockly.FieldAngle.HALF;
  var y2 = Blockly.FieldAngle.HALF;
  if (!isNaN(angleRadians)) {
    var angle1 = Blockly.utils.toRadians(offset);
    var x1 = Math.cos(angle1) * Blockly.FieldAngle.RADIUS;
    var y1 = Math.sin(angle1) * -Blockly.FieldAngle.RADIUS;
    if (clockwise) {
      angleRadians = 2 * angle1 - angleRadians;
    }
    x2 += Math.cos(angleRadians) * Blockly.FieldAngle.RADIUS;
    y2 -= Math.sin(angleRadians) * Blockly.FieldAngle.RADIUS;
    // Don't ask how the flag calculations work.  They just do.
    var largeFlag = Math.abs(Math.floor((angleRadians - angle1) / Math.PI) % 2);
    if (clockwise) {
      largeFlag = 1 - largeFlag;
    }
    var sweepFlag = Number(clockwise);
    path.push(' l ', x1, ',', y1,
        ' A ', Blockly.FieldAngle.RADIUS, ',', Blockly.FieldAngle.RADIUS,
        ' 0 ', largeFlag, ' ', sweepFlag, ' ', x2, ',', y2, ' z');
  }
  this.gauge_.setAttribute('d', path.join(''));
  this.line_.setAttribute('x2', x2);
  this.line_.setAttribute('y2', y2);
};

/**
 * Ensure that only an angle may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid angle, or null if invalid.
 */
Blockly.FieldAngle.prototype.classValidator = function(text) {
  if (text === null) {
    return null;
  }
  var n = parseFloat(text || 0);
  if (isNaN(n)) {
    return null;
  }
  n %= 360;
  if (n < 0) {
    n += 360;
  }
  if (n > this.getWrap()) {
    n -= 360;
  }
  return String(n);
};

/**
 * Set which direction should make the graphical angle editor increase.
 * @param {?boolean} clockwise Whether the graphical angle editor should
 *    increase as it is moved clockwise (true) or counterclockwise (false)
 *    or the global setting (null).
 * @return {!Blockly.FieldAngle} Returns itself (for method chaining).
 */
Blockly.FieldAngle.prototype.setClockwise = function(clockwise) {
  this.clockwise_ = clockwise;
  return this;
};

/**
 * Set the offset of zero degrees. Usually 0 (right) or 90 (up).
 * @param {?number} offset The amount to offset the location of 0 degrees
 *    by. Always offsets in the clockwise direction independent of the
 *    Clockwise property. Pass null to use the
 *    global setting.
 * @return {!Blockly.FieldAngle} Returns itself (for method chaining).
 */
Blockly.FieldAngle.prototype.setOffset = function(offset) {
  this.offset_ = offset;
  return this;
};

/**
 * Set the wrap/range of the angle field. The range is equal to (-360 +
 * WRAP, WRAP).
 * Usually either 360 (for 0 to 359.9) or 180 (for -179.9 to 180).
 * @param {?number} wrap The wrap value of the angle field. Pass null to use
 *    the global setting.
 * @return {!Blockly.FieldAngle} Returns itself (for method chaining).
 */
Blockly.FieldAngle.prototype.setWrap = function(wrap) {
  this.wrap_ = wrap;
  return this;
};

/**
 * Set the rounding of the angle field's graphical editor.
 * @param {?number} round The value (when input through the graphical
 *    editor) will be rounded to the nearest multiple of this number. Pass 0
 *    to disable rounding. Pass null to use the global setting.
 * @return {!Blockly.FieldAngle} Returns itself (for method chaining).
 */
Blockly.FieldAngle.prototype.setRound = function(round) {
  this.round_ = round;
  return this;
};

/**
 * Get the direction the angle field's value increases in.
 * @return {boolean} Clockwise (true) or counterclockwise (false).
 */
Blockly.FieldAngle.prototype.getClockwise = function() {
  if (this.clockwise_ == null) {
    return Blockly.FieldAngle.CLOCKWISE;
  }
  return this.clockwise_;
};

/**
 * Get the amount 0 degrees is offset by.
 * @return {number} The amount of offset.
 */
Blockly.FieldAngle.prototype.getOffset = function() {
  if (this.offset_ == null) {
    return Blockly.FieldAngle.OFFSET;
  }
  return this.offset_;
};

/**
 * Get the wrap value of the angle field.
 * @return {number} The number the angle field gets wrapped at.
 */
Blockly.FieldAngle.prototype.getWrap = function() {
  if (this.wrap_ == null) {
    return Blockly.FieldAngle.WRAP;
  }
  return this.wrap_;
};

/**
 * Get the number values input via the graphical editor are rounded to.
 * @return {number} The round value.
 */
Blockly.FieldAngle.prototype.getRound = function() {
  if (this.round_ == null) {
    return Blockly.FieldAngle.ROUND;
  }
  return this.round_;
};

Blockly.Field.register('field_angle', Blockly.FieldAngle);
