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
 * @fileoverview Percent input field.
 * @author bekawestberg@gmail.com
 */
'use strict';

goog.provide('Blockly.FieldPercent');

goog.require('Blockly.FieldNumber');

/**
 * Class for an editable percent field.
 * @param {number} opt_value The initial value of the field. Should be
 *    between 0 and 1 (inclusive). Defaults to 0.
 * @param opt_validator A function that is called to validate
 *    changes to the field's value. Takes in a number & returns a validated
 *    number, or null to abort the change.
 * @extends {Blockly.FieldNumber}
 * @constructor
 */
Blockly.FieldPercent = function(opt_value, opt_validator) {
  Blockly.FieldPercent.superClass_.constructor.call(
      this, opt_value, 0, 1, .001, opt_validator);
};
goog.inherits(Blockly.FieldPercent, Blockly.FieldNumber);

/**
 * Construct a FieldPercent from a JSON arg object.
 * @param {!Object} options A JSON object with options (value).
 * @return {Blockly.FieldPercent} The new field instance.
 */
Blockly.FieldPercent.fromJson = function(options) {
  return new Blockly.FieldPercent(options['value']);
};

/**
 * Serializable fields are saved by the XML renderer, non-serializable fields
 * are not. Editable fields should also be serializable.
 * @type {boolean}
 * @const
 */
Blockly.FieldPercent.prototype.SERIALIZABLE = true;

/**
 * Mouse cursor style when over the hot spot that initiates the editor.
 */
Blockly.FieldPercent.prototype.CURSOR = 'ew-resize';

/**
 * Bind custom "scrubby" events to the field.
 * @private
 */
Blockly.FieldPercent.prototype.bindEvents_ = function() {
  Blockly.FieldPercent.superClass_.bindEvents_.call(this);

  this.mouseDownWrapper_ =
    Blockly.bindEventWithChecks_(this.getClickTarget_(), 'mousedown', this,
      function(event) {
        if (this.getSourceBlock().isInFlyout) {
          return;
        }
        this.isMouseDown_ = true;
        this.lastMovePostion_ = event.clientX;
        this.lastMoveTime_ = new Date().getTime();
        event.stopPropagation();
      }
    );
  this.mouseMoveWrapper_ =
    Blockly.bindEventWithChecks_(document, 'mousemove', this,
      function(event) {
        if (!this.isMouseDown_) {
          return;
        }

        var currentPosition = event.clientX;
        var currentTime = new Date().getTime();
        var moveDelta = currentPosition - this.lastMovePostion_;
        var timeDelta = currentTime - this.lastMoveTime_;
        var velocity = moveDelta / timeDelta;
        var valueDelta = this.velocityToValueDelta(velocity);

        this.setValue(this.getValue() + valueDelta);

        this.lastMovePostion_ = currentPosition;
        this.lastMoveTime_ = currentTime;
        event.preventDefault();
      }
    );
  this.mouseUpWrapper_ =
    Blockly.bindEventWithChecks_(document, 'mouseup', this,
      function(_event) {
        this.isMouseDown_ = false;
      }
    );
};

/**
 * Dispose of event listeners.
 */
Blockly.FieldPercent.prototype.dispose = function() {
  Blockly.FieldPercent.superClass_.dispose.call(this);
  Blockly.unbindEvent_(this.mouseDownWrapper_);
  Blockly.unbindEvent_(this.mouseMoveWrapper_);
  Blockly.unbindEvent_(this.mouseUpWrapper_);
};

/**
 * Convert a velocity value to a good feeling value delta. Smaller
 * velocities give smaller deltas, larger velocities give larger deltas.
 * @param {number} velocity The current velocity of mouse movement.
 * @return {number} The value delta corresponding to the velocity.
 */
Blockly.FieldPercent.prototype.velocityToValueDelta = function(velocity) {
  var absVelocity = Math.abs(velocity);
  // Evaluate it on an arbitrary curve that feels good.
  var delta = .001 + (-.0008 * absVelocity) + (.008 * Math.pow(absVelocity, 2));
  delta *= Math.sign(velocity);
  return delta;
};

/**
 * Create and show the percent field's editor.
 * @private
 */
Blockly.FieldPercent.prototype.showEditor_ = function() {
  // NoOp.
};

/**
 * Get the text representing the percent field's value.
 * @return {string} The text representing the percent field's value.
 */
Blockly.FieldPercent.prototype.getText = function() {
  return (this.value_ * 100).toFixed(1).toString() + '%';
};

/**
 * Get the text for use in displaying the field's value on the block.
 * @return {string} The text representing the percent field's value.
 * @protected
 */
Blockly.FieldPercent.prototype.getDisplayText_ = function() {
  return this.getText();
};

Blockly.Field.register('field_percent', Blockly.FieldPercent);
