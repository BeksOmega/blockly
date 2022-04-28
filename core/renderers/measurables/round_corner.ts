/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Objects representing a round corner in a row of a rendered
 * block.
 */

/**
 * Objects representing a round corner in a row of a rendered
 * block.
 * @class
 */


/* eslint-disable-next-line no-unused-vars */
import type {ConstantProvider} from '../common/constants';
import {Measurable} from './base';
import {Types} from './types';


/**
 * An object containing information about the space a rounded corner takes up
 * during rendering.
 * @extends {Measurable}
 * @struct
 * @alias Blockly.blockRendering.RoundCorner
 */
class RoundCorner extends Measurable {
  /**
   * @param {!ConstantProvider} constants The rendering
   *   constants provider.
   * @param {string=} opt_position The position of this corner.
   * @package
   */
  constructor(constants, opt_position) {
    super(constants);
    this.type = ((!opt_position || opt_position === 'left') ?
                     Types.LEFT_ROUND_CORNER :
                     Types.RIGHT_ROUND_CORNER) |
        Types.CORNER;
    this.width = this.constants_.CORNER_RADIUS;
    // The rounded corner extends into the next row by 4 so we only take the
    // height that is aligned with this row.
    this.height = this.constants_.CORNER_RADIUS / 2;
  }
}

export {RoundCorner};
