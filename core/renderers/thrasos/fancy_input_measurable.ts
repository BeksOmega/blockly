import { Input } from "../../inputs/input.js";
import { ConstantProvider } from "../common/constants.js";
import { InputConnection } from "../measurables/input_connection.js";
import { Types } from "../measurables/types.js";

export class FancyInputMeasurable extends InputConnection {
  connectionHeight = 10;
  connectionWidth = 0;

  /**
   * @param constants The rendering constants provider.
   * @param input The inline input to measure and store information for.
   */
  constructor(constants: ConstantProvider, input: Input) {
    super(constants, input);
    this.type |= Types.INLINE_INPUT;

    this.height = 10;
    this.width = 10;
    this.connectionOffsetY = 5;
    this.connectionOffsetX = 5;
  }
}
