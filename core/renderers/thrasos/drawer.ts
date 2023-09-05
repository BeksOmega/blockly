import { Drawer } from "../common/drawer.js";
import { FancyInputMeasurable } from "./fancy_input_measurable.js";


export class ThrasosDrawer extends Drawer {
  protected drawInlineInput_(input: FancyInputMeasurable) {
    this.positionInlineInputConnection_(input);
  }
}
