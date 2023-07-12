
import type {Block} from '../block.js';
import { ConnectionType } from '../connection_type.js';
import {Input} from './input.js';
import { inputTypes } from './input_types.js';

export class CustomInput extends Input {
  type = inputTypes.VALUE;

  constructor(public name: string, block: Block) {
    super(name, block);
    this.connection = this.makeConnection(ConnectionType.INPUT_VALUE);
  }
}
