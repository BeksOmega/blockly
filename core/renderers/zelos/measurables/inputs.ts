/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Zelos specific objects representing inputs with connections on
 * a rendered block.
 */

/**
 * Zelos specific objects representing inputs with connections on
 * a rendered block.
 * @class
 */


/* eslint-disable-next-line no-unused-vars */
import type {ConstantProvider} from '../../common/constants';
/* eslint-disable-next-line no-unused-vars */
import type {Input} from '../../../input';
import {StatementInput as BaseStatementInput} from '../../measurables/statement_input';


/**
 * An object containing information about the space a statement input takes up
 * during rendering.
 * @extends {BaseStatementInput}
 * @alias Blockly.zelos.StatementInput
 */
class StatementInput extends BaseStatementInput {
  /**
   * @param {!ConstantProvider} constants The rendering constants provider.
   * @param {!Input} input The statement input to measure and store information
   *    for.
   * @package
   */
  constructor(constants, input) {
    super(constants, input);

    if (this.connectedBlock) {
      // Find the bottom-most connected block in the stack.
      let block = this.connectedBlock;
      let nextBlock;
      while ((nextBlock = block.getNextBlock())) {
        block = nextBlock;
      }
      if (!block.nextConnection) {
        this.height = this.connectedBlockHeight;
        this.connectedBottomNextConnection = true;
      }
    }
  }
}

export {StatementInput};
