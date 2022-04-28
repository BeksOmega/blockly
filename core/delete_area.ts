/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The abstract class for a component that can delete a block or
 * bubble that is dropped on top of it.
 */

'use strict';

/**
 * The abstract class for a component that can delete a block or
 * bubble that is dropped on top of it.
 * @class
 */


import {BlockSvg} from './block_svg';
import {DragTarget} from './drag_target';
/* eslint-disable-next-line no-unused-vars */
import {IDeleteArea} from './interfaces/i_delete_area';
/* eslint-disable-next-line no-unused-vars */
import type {IDraggable} from './interfaces/i_draggable';


/**
 * Abstract class for a component that can delete a block or bubble that is
 * dropped on top of it.
 * @extends {DragTarget}
 * @implements {IDeleteArea}
 * @alias Blockly.DeleteArea
 */
class DeleteArea extends DragTarget {
  /**
   * Constructor for DeleteArea. Should not be called directly, only by a
   * subclass.
   */
  constructor() {
    super();

    /**
     * Whether the last block or bubble dragged over this delete area would be
     * deleted if dropped on this component.
     * This property is not updated after the block or bubble is deleted.
     * @type {boolean}
     * @protected
     */
    this.wouldDelete_ = false;

    /**
     * The unique id for this component that is used to register with the
     * ComponentManager.
     * @type {string}
     */
    this.id;
  }

  /**
   * Returns whether the provided block or bubble would be deleted if dropped on
   * this area.
   * This method should check if the element is deletable and is always called
   * before onDragEnter/onDragOver/onDragExit.
   * @param {!IDraggable} element The block or bubble currently being
   *   dragged.
   * @param {boolean} couldConnect Whether the element could could connect to
   *     another.
   * @return {boolean} Whether the element provided would be deleted if dropped
   *     on this area.
   */
  wouldDelete(element, couldConnect) {
    if (element instanceof BlockSvg) {
      const block = /** @type {BlockSvg} */ (element);
      const couldDeleteBlock = !block.getParent() && block.isDeletable();
      this.updateWouldDelete_(couldDeleteBlock && !couldConnect);
    } else {
      this.updateWouldDelete_(element.isDeletable());
    }
    return this.wouldDelete_;
  }

  /**
   * Updates the internal wouldDelete_ state.
   * @param {boolean} wouldDelete The new value for the wouldDelete state.
   * @protected
   */
  updateWouldDelete_(wouldDelete) {
    this.wouldDelete_ = wouldDelete;
  }
}

export {DeleteArea};
