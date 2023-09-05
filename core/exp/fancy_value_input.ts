import type {Block} from '../block.js';
import { BlockSvg } from '../block_svg.js';
import {ConnectionType} from '../connection_type.js';
import {Input} from '../inputs/input.js';
import {inputTypes} from '../inputs/input_types.js';
import { FancyConnection } from './fancy_connection.js';

/** Represents an input on a block with a value connection. */
export class FancyValueInput extends Input {
  readonly type = inputTypes.VALUE;

  /**
   * @param name Language-neutral identifier which may used to find this input
   *     again.
   * @param block The block containing this input.
   */
  constructor(
    public name: string,
    block: Block,
  ) {
    // Errors are maintained for people not using typescript.
    if (!name) throw new Error('Value inputs must have a non-empty name');
    super(name, block);
    this.connection = new FancyConnection(block as BlockSvg, ConnectionType.INPUT_VALUE);
  }
}
