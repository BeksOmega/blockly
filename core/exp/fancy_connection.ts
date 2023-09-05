import { BlockSvg } from "../block_svg.js";
import { RenderedConnection } from "../rendered_connection.js";
import {Svg} from "../utils/svg.js";
import * as dom from '../utils/dom.js';

export class FancyConnection extends RenderedConnection {
  nugget: SVGEllipseElement | null = null;

  constructor(source: BlockSvg, type: number) {
    super(source, type);

    const offset = this.getOffsetInBlock();
    this.nugget = dom.createSvgElement(
      Svg.ELLIPSE,
      {
        'cx': 0,
        'cy': 0,
        'rx': 5,
        'ry': 5,
        'transform':
          `translate(${offset.x}, ${offset.y})` +
          (this.sourceBlock_.RTL ? ' scale(-1 1)' : ''),
      },
      this.sourceBlock_.getSvgRoot());
  }

  moveTo(x: number, y: number): boolean {
    const val = super.moveTo(x, y);
    if (this.nugget) {
      const offset = this.getOffsetInBlock();
      this.nugget.setAttribute('transform',`translate(${offset.x}, ${offset.y})`);
    }
    return val;
  }
}
