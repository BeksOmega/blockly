/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ConstantProvider as BaseConstantProvider, DynamicShape, Shape} from '../common/constants.js';
import * as svgPaths from '../../utils/svg_paths.js';
import { RenderedConnection } from '../../rendered_connection.js';
import { ConnectionType } from '../../connection_type.js';

/**
 * An object that provides constants for rendering blocks in Geras mode.
 */
export class ConstantProvider extends BaseConstantProvider {
  private ROUND_TAB!: Shape;
  private TRIANGULAR_TAB!: Shape;

  init() {
    super.init();
    this.ROUND_TAB = this.makeRoundTab();
    this.TRIANGULAR_TAB = this.makeTriangularTab();
  }

  makeRoundTab() {
    const size = Math.round(Math.min(this.TAB_WIDTH, this.TAB_HEIGHT));

    return {
      type: this.SHAPES.NOTCH,
      width: size,
      height: size,
      pathUp: svgPaths.arc(
        'a', `0 1 1 `, size / 2, `0,-${size}`),
      pathDown: svgPaths.arc(
        'a', `0 1 0 `, size / 2, `0,${size}`),
    };
  }

  makeTriangularTab() {
    const width = this.TAB_WIDTH;
    const height = this.TAB_HEIGHT;
    return {
      type: this.SHAPES.NOTCH,
      width: this.TAB_WIDTH,
      height: this.TAB_HEIGHT,
      pathUp: svgPaths.line(
          [svgPaths.point(-width, -height / 2),
          svgPaths.point(width, -height / 2)]),
      pathDown: svgPaths.line(
          [svgPaths.point(-width, height / 2),
          svgPaths.point(width, height / 2)]),
    };
  }

  shapeFor(connection: RenderedConnection): Shape {
    let check = connection.getCheck();
    if (!check && connection.targetConnection) {
      check = connection.targetConnection.getCheck();
    }

    switch (connection.type) {
      case ConnectionType.INPUT_VALUE:
      case ConnectionType.OUTPUT_VALUE:
        if (check && check.includes('Boolean')) return this.ROUND_TAB;
        if (check && check.includes('String')) return this.TRIANGULAR_TAB;
        return this.PUZZLE_TAB;
      case ConnectionType.PREVIOUS_STATEMENT:
      case ConnectionType.NEXT_STATEMENT:
        return this.NOTCH;
      default:
        throw Error('Unknown connection type');
    }
  }
}
