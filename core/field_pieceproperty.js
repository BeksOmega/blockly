/**
 * @fileoverview Piece Property Field. Used for creating 'piece_property'
 * blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldPieceProperty');

goog.require('Blockly.Field');
goog.require('Blockly.Tooltip');
goog.require('Blockly.utils');

goog.require('goog.math.Size');

/**
 * Class for a piece property field. Draws paths that look like a
 * 'piece_property' block, and if enabled creates 'piece_property' blocks when
 * clicked.
 * @param {!string} text The text to display on the "block" vis. the name of
 *    the property.
 * @param {boolean=} opt_disabled True to disallow the field from creating
 *    'piece_property' blocks. False by default.
 */
Blockly.FieldPieceProperty = function(text, opt_disabled) {
  this.size_ = new goog.math.Size(0, Blockly.BlockSvg.MIN_BLOCK_Y);
  this.setValue(text);

  this.disabled = opt_disabled || false;
  if (this.disabled){
    this.CURSOR = 'grab';
  } else {
    this.CURSOR = 'default';
  }
};
goog.inherits(Blockly.FieldPieceProperty, Blockly.Field);

/**
 * Construct a FieldPieceProperty from a JSON arg object.
 * Not exactly sure how this works, so it's probably broken.
 * @param {!Object}  options A JSON object with options (options).
 * @returns {!Blockly.FieldPieceProperty} The new field instance.
 */
Blockly.FieldPieceProperty.fromJson = function(options) {
  return new Blockly.FieldPieceProperty(options);
};

/**
 * Install this field on a block.
 */
Blockly.FieldPieceProperty.prototype.init = function() {
  if (this.fieldGroup_) {
    return;
  }

  Blockly.FieldPieceProperty.superClass_.init.call(this);
  // Don't show the background "bubble".
  this.borderRect_.setAttribute('style', 'visibility: hidden');
  // Center the text element.
  this.textElement_.setAttribute('transform', 'translate(13, 8)');

  // Indicate that a disable field cannot be clicked.
  if (this.disabled){
    this.CURSOR = 'grab';
    Blockly.utils.addClass(this.fieldGroup_, 'blocklyDisabledAttributeField');
  } else {
    Blockly.utils.addClass(this.fieldGroup_, 'blocklyAttributeField');
  }

  this.mouseDownWrapper_ =
      Blockly.bindEventWithChecks_(
          this.fieldGroup_, 'mousedown', this, this.onMouseDown_);

  this.render_();
};

/**
 * Overrides the showEditor_ function of the parent (basically onClick) to
 * create the new block (if the field is not disabled).
 */
Blockly.FieldPieceProperty.prototype.showEditor_ = function() {
  if (this.sourceBlock_.isInFlyout || this.disabled){
    return;
  }
  var block = workspace.newBlock('piece_property');
  block.setFieldValue(this.text_, 'NAME');
  block.initSvg();
  block.render();
  block.data = this.sourceBlock_.getFieldValue('PIECE_NAME') + "," + this.id;

  block.select();
  var parentPos = this.sourceBlock_.getRelativeToSurfaceXY();
  block.moveBy(parentPos.x + this.sourceBlock_.width + 12, parentPos.y);
};

/**
 * Draws the field.
 */
Blockly.FieldPieceProperty.prototype.render_ = function() {
  Blockly.Field.prototype.render_.call(this);

  if (this.size_.width === 0){
    return;
  }

  var attributeBoxWidth = this.size_.width + 10; //10 = padding
  this.size_.width = this.size_.width + 14; //22 = padding + margin
  this.size_.height = 38;
  var steps = 'm 8,2 ' + Blockly.BlockSvg.TAB_PATH_DOWN + ' v 5 h ' +
      attributeBoxWidth + ' v -24.5 h -' + attributeBoxWidth;
  var xy = this.sourceBlock_.getRelativeToSurfaceXY();

  this.pathDark_ = Blockly.utils.createSvgElement('path',
      {'class': 'blocklyPathDark','d': steps, 'transform' : 'translate(1,1)'},
      null);
  this.pathLight_ = Blockly.utils.createSvgElement('path',
      {'class': 'blocklyPathLight','d': steps, 'transform' : 'translate(-1,-1)'},
      null);
  this.path_ = Blockly.utils.createSvgElement('path',
      {'class': 'blocklyPath','d': steps}, null);

  this.fieldGroup_.insertBefore(this.pathDark_, this.textElement_);
  this.fieldGroup_.insertBefore(this.pathLight_, this.textElement_);
  this.fieldGroup_.insertBefore(this.path_, this.textElement_);

  if (this.sourceBlock_ && this.path_) {
    var hexColor = this.sourceBlock_.getColour();
    var rgb = goog.color.hexToRgb(hexColor);
    var hexDark = goog.color.rgbArrayToHex(goog.color.darken(rgb, 0.2));
    var hexLight = goog.color.rgbArrayToHex(goog.color.lighten(rgb, 0.3));

    this.pathDark_.style.fill = hexDark;
    this.pathLight_.style.fill = hexLight;
    this.path_.style.fill = hexColor;
  }
};

/**
 * Dispose of all DOM objects belonging to the field.
 */
Blockly.FieldPieceProperty.prototype.dispose = function() {
  Blockly.Field.prototype.dispose.call(this);
  this.pathDark_ = null;
  this.pathLight_ = null;
  this.path_ = null;
};

Blockly.Field.register('field_pieceproperty', Blockly.FieldPieceProperty);
