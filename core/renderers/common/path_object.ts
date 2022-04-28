/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview An object that owns a block's rendering SVG elements.
 */

'use strict';

/**
 * An object that owns a block's rendering SVG elements.
 * @class
 */


import * as dom from '../../utils/dom';
/* eslint-disable-next-line no-unused-vars */
import type {BlockSvg} from '../../block_svg';
/* eslint-disable-next-line no-unused-vars */
import type {Connection} from '../../connection';
/* eslint-disable-next-line no-unused-vars */
import type {ConstantProvider} from './constants';
/* eslint-disable-next-line no-unused-vars */
import {IPathObject} from './i_path_object';
import {Svg} from '../../utils/svg';
/* eslint-disable-next-line no-unused-vars */
import type {Theme} from '../../theme';


/**
 * An object that handles creating and setting each of the SVG elements
 * used by the renderer.
 * @implements {IPathObject}
 * @alias Blockly.blockRendering.PathObject
 */
class PathObject {
  /**
   * @param {!SVGElement} root The root SVG element.
   * @param {!Theme.BlockStyle} style The style object to use for
   *     colouring.
   * @param {!ConstantProvider} constants The renderer's
   *     constants.
   * @package
   */
  constructor(root, style, constants) {
    /**
     * The renderer's constant provider.
     * @type {!ConstantProvider}
     * @package
     */
    this.constants = constants;

    this.svgRoot = root;

    /**
     * The primary path of the block.
     * @type {!SVGElement}
     * @package
     */
    this.svgPath =
        dom.createSvgElement(Svg.PATH, {'class': 'blocklyPath'}, this.svgRoot);

    /**
     * The style object to use when colouring block paths.
     * @type {!Theme.BlockStyle}
     * @package
     */
    this.style = style;

    /**
     * Holds the cursors svg element when the cursor is attached to the block.
     * This is null if there is no cursor on the block.
     * @type {SVGElement}
     * @package
     */
    this.cursorSvg = null;

    /**
     * Holds the markers svg element when the marker is attached to the block.
     * This is null if there is no marker on the block.
     * @type {SVGElement}
     * @package
     */
    this.markerSvg = null;
  }

  /**
   * Set the path generated by the renderer onto the respective SVG element.
   * @param {string} pathString The path.
   * @package
   */
  setPath(pathString) {
    this.svgPath.setAttribute('d', pathString);
  }

  /**
   * Flip the SVG paths in RTL.
   * @package
   */
  flipRTL() {
    // Mirror the block's path.
    this.svgPath.setAttribute('transform', 'scale(-1 1)');
  }

  /**
   * Add the cursor SVG to this block's SVG group.
   * @param {SVGElement} cursorSvg The SVG root of the cursor to be added to the
   *     block SVG group.
   * @package
   */
  setCursorSvg(cursorSvg) {
    if (!cursorSvg) {
      this.cursorSvg = null;
      return;
    }

    this.svgRoot.appendChild(cursorSvg);
    this.cursorSvg = cursorSvg;
  }

  /**
   * Add the marker SVG to this block's SVG group.
   * @param {SVGElement} markerSvg The SVG root of the marker to be added to the
   *     block SVG group.
   * @package
   */
  setMarkerSvg(markerSvg) {
    if (!markerSvg) {
      this.markerSvg = null;
      return;
    }

    if (this.cursorSvg) {
      this.svgRoot.insertBefore(markerSvg, this.cursorSvg);
    } else {
      this.svgRoot.appendChild(markerSvg);
    }
    this.markerSvg = markerSvg;
  }

  /**
   * Apply the stored colours to the block's path, taking into account whether
   * the paths belong to a shadow block.
   * @param {!BlockSvg} block The source block.
   * @package
   */
  applyColour(block) {
    this.svgPath.setAttribute('stroke', this.style.colourTertiary);
    this.svgPath.setAttribute('fill', this.style.colourPrimary);

    this.updateShadow_(block.isShadow());
    this.updateDisabled_(!block.isEnabled() || block.getInheritedDisabled());
  }

  /**
   * Set the style.
   * @param {!Theme.BlockStyle} blockStyle The block style to use.
   * @package
   */
  setStyle(blockStyle) {
    this.style = blockStyle;
  }

  /**
   * Add or remove the given CSS class on the path object's root SVG element.
   * @param {string} className The name of the class to add or remove
   * @param {boolean} add True if the class should be added.  False if it should
   *     be removed.
   * @protected
   */
  setClass_(className, add) {
    if (add) {
      dom.addClass(/** @type {!Element} */ (this.svgRoot), className);
    } else {
      dom.removeClass(/** @type {!Element} */ (this.svgRoot), className);
    }
  }

  /**
   * Set whether the block shows a highlight or not.  Block highlighting is
   * often used to visually mark blocks currently being executed.
   * @param {boolean} enable True if highlighted.
   * @package
   */
  updateHighlighted(enable) {
    if (enable) {
      this.svgPath.setAttribute(
          'filter', 'url(#' + this.constants.embossFilterId + ')');
    } else {
      this.svgPath.setAttribute('filter', 'none');
    }
  }

  /**
   * Updates the look of the block to reflect a shadow state.
   * @param {boolean} shadow True if the block is a shadow block.
   * @protected
   */
  updateShadow_(shadow) {
    if (shadow) {
      this.svgPath.setAttribute('stroke', 'none');
      this.svgPath.setAttribute('fill', this.style.colourSecondary);
    }
  }

  /**
   * Updates the look of the block to reflect a disabled state.
   * @param {boolean} disabled True if disabled.
   * @protected
   */
  updateDisabled_(disabled) {
    this.setClass_('blocklyDisabled', disabled);
    if (disabled) {
      this.svgPath.setAttribute(
          'fill', 'url(#' + this.constants.disabledPatternId + ')');
    }
  }

  /**
   * Add or remove styling showing that a block is selected.
   * @param {boolean} enable True if selection is enabled, false otherwise.
   * @package
   */
  updateSelected(enable) {
    this.setClass_('blocklySelected', enable);
  }

  /**
   * Add or remove styling showing that a block is dragged over a delete area.
   * @param {boolean} enable True if the block is being dragged over a delete
   *     area, false otherwise.
   * @package
   */
  updateDraggingDelete(enable) {
    this.setClass_('blocklyDraggingDelete', enable);
  }

  /**
   * Add or remove styling showing that a block is an insertion marker.
   * @param {boolean} enable True if the block is an insertion marker, false
   *     otherwise.
   * @package
   */
  updateInsertionMarker(enable) {
    this.setClass_('blocklyInsertionMarker', enable);
  }

  /**
   * Add or remove styling showing that a block is movable.
   * @param {boolean} enable True if the block is movable, false otherwise.
   * @package
   */
  updateMovable(enable) {
    this.setClass_('blocklyDraggable', enable);
  }

  /**
   * Add or remove styling that shows that if the dragging block is dropped,
   * this block will be replaced.  If a shadow block, it will disappear.
   * Otherwise it will bump.
   * @param {boolean} enable True if styling should be added.
   * @package
   */
  updateReplacementFade(enable) {
    this.setClass_('blocklyReplaceable', enable);
  }

  /**
   * Add or remove styling that shows that if the dragging block is dropped,
   * this block will be connected to the input.
   * @param {Connection} _conn The connection on the input to highlight.
   * @param {boolean} _enable True if styling should be added.
   * @package
   */
  updateShapeForInputHighlight(_conn, _enable) {
    // NOP
  }
}

export {PathObject};
