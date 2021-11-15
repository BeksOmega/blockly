/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Objects representing inline inputs with connections on a
 * rendered block.
 * @author kozbial@google.com (Monica Kozbial)
 */
'use strict';

/**
 * Objects representing inline inputs with connections on a
 * rendered block.
 * @namespace Blockly.geras.InlineInput
 */
goog.module('Blockly.geras.InlineInput');

const BaseInlineInput = goog.require('Blockly.blockRendering.InlineInput');
/* eslint-disable-next-line no-unused-vars */
const ConstantProvider = goog.requireType('Blockly.blockRendering.ConstantProvider');
/* eslint-disable-next-line no-unused-vars */
const Input = goog.requireType('Blockly.Input');
const object = goog.require('Blockly.utils.object');


/**
 * An object containing information about the space an inline input takes up
 * during rendering
 * @param {!ConstantProvider} constants The rendering
 *   constants provider.
 * @param {!Input} input The inline input to measure and store
 *     information for.
 * @package
 * @constructor
 * @extends {BaseInlineInput}
 * @alias Blockly.geras.InlineInput
 */
const InlineInput = function(constants, input) {
  InlineInput.superClass_.constructor.call(this, constants, input);

  if (this.connectedBlock) {
    // We allow the dark path to show on the parent block so that the child
    // block looks embossed.  This takes up an extra pixel in both x and y.
    this.width += this.constants_.DARK_PATH_OFFSET;
    this.height += this.constants_.DARK_PATH_OFFSET;
  }
};
object.inherits(InlineInput, BaseInlineInput);

exports = InlineInput;