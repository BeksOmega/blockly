
import { Input } from "../../inputs.js";
import {InputConnection} from "../measurables/input_connection.js";
import { ConstantProvider } from "./constants.js";

export class IndentedValueInput extends InputConnection {
  constructor(constants: ConstantProvider, input: Input) {
    super(constants, input);

    if (!this.connectedBlock) {
      this.height = this.constants_.EMPTY_STATEMENT_INPUT_HEIGHT;
    } else {
      // We allow the dark path to show on the parent block so that the child
      // block looks embossed.  This takes up an extra pixel in both x and y.
      this.height =
        this.connectedBlockHeight + this.constants_.STATEMENT_BOTTOM_SPACER;
    }
    this.width = (this.shape.width as number) + 50;
  }
}
