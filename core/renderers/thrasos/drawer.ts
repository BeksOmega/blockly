
import {Drawer as BaseDrawer} from '../common/drawer.js';
import { Row } from '../measurables/row.js';
import { IndentedValueInput } from './indented_input.js';

export class Drawer extends BaseDrawer {
  protected drawOutline_() {
    this.drawTop_();
    for (let r = 1; r < this.info_.rows.length - 1; r++) {
      const row = this.info_.rows[r];
      if (row.getLastInput() instanceof IndentedValueInput) {
        this.drawIndentedValue(row);
      }
      if (row.hasJaggedEdge) {
        this.drawJaggedEdge_(row);
      } else if (row.hasStatement) {
        this.drawStatementInput_(row);
      } else if (row.hasExternalInput) {
        this.drawValueInput_(row);
      } else {
        this.drawRightSideRow_(row);
      }
    }
    this.drawBottom_();
    this.drawLeft_();
  }

  drawIndentedValue(row: Row) {
    const input = row.getLastInput();
    if (!input) return;
  }
}
