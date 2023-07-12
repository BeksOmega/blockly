
import type {Block} from '../block.js';
import {Input} from './input.js';

export class CustomInput extends Input {
  constructor(public name: string, block: Block) {
    super(name, block);
  }
}
