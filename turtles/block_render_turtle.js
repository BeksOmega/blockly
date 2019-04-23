'use strict';

goog.provide('Blockly.BlockSvg.render');

goog.require('Blockly.BlockSvg');

/**
 * Returns a bounding box describing the dimensions of this block
 * and any blocks stacked below it.
 * @return {!{height: number, width: number}} Object with height and width
 *    properties in workspace units.
 */
Blockly.BlockSvg.prototype.getHeightWidth = function() {
  return {height: 56, width: 56};
};

/**
 * Render the block.
 * Lays out and reflows a block based on its contents and settings.
 * @param {boolean=} opt_bubble If false, just render this block.
 *   If true, also render block's parent, grandparent, etc.  Defaults to true.
 */
Blockly.BlockSvg.prototype.render = function(opt_bubble) {
  /*console.log(this.workspace);
  console.log(this.workspace.options);*/
  this.rendered = true;

  this.svgImage_ = Blockly.utils.createSvgElement('image', {}, this.svgGroup_);
  this.svgImage_.setAttribute('xlink:href',
      this.workspace.options.pathToMedia + 'basic_turtle.svg');
  this.svgImage_.setAttribute('width', '56');
  this.svgImage_.setAttribute('height', '56');
  console.log(this.svgImage_.parentElement);
};


