/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A separator used for separating toolbox categories.
 */
'use strict';

/**
 * A separator used for separating toolbox categories.
 * @class
 */


import * as Css from '../css';
import * as dom from '../utils/dom';
import * as object from '../utils/object';
import * as registry from '../registry';
/* eslint-disable-next-line no-unused-vars */
import type * as toolbox from '../utils/toolbox';
/* eslint-disable-next-line no-unused-vars */
import type {IToolbox} from '../interfaces/i_toolbox';
import {ToolboxItem} from './toolbox_item';


/**
 * Class for a toolbox separator. This is the thin visual line that appears on
 * the toolbox. This item is not interactable.
 * @extends {ToolboxItem}
 * @alias Blockly.ToolboxSeparator
 */
class ToolboxSeparator extends ToolboxItem {
  /**
   * @param {!toolbox.SeparatorInfo} separatorDef The information
   *     needed to create a separator.
   * @param {!IToolbox} toolbox The parent toolbox for the separator.
   */
  constructor(separatorDef, toolbox) {
    super(separatorDef, toolbox);
    /**
     * All the CSS class names that are used to create a separator.
     * @type {!ToolboxSeparator.CssConfig}
     * @protected
     */
    this.cssConfig_ = {'container': 'blocklyTreeSeparator'};

    /**
     * @type {?HTMLDivElement}
     * @private
     */
    this.htmlDiv_ = null;

    const cssConfig = separatorDef['cssconfig'] || separatorDef['cssConfig'];
    object.mixin(this.cssConfig_, cssConfig);
  }

  /**
   * @override
   */
  init() {
    this.createDom_();
  }

  /**
   * Creates the DOM for a separator.
   * @return {!HTMLDivElement} The parent element for the separator.
   * @protected
   */
  createDom_() {
    const container =
        /** @type {!HTMLDivElement} */ (document.createElement('div'));
    dom.addClass(container, this.cssConfig_['container']);
    this.htmlDiv_ = container;
    return container;
  }

  /**
   * @override
   */
  getDiv() {
    return /** @type {!HTMLDivElement} */ (this.htmlDiv_);
  }

  /**
   * @override
   */
  dispose() {
    dom.removeNode(/** @type {!HTMLDivElement} */ (this.htmlDiv_));
  }
}

/**
 * All the CSS class names that are used to create a separator.
 * @typedef {{
 *            container:(string|undefined)
 *          }}
 */
ToolboxSeparator.CssConfig;

/**
 * Name used for registering a toolbox separator.
 * @type {string}
 */
ToolboxSeparator.registrationName = 'sep';

/**
 * CSS for Toolbox.  See css.js for use.
 */
Css.register(`
.blocklyTreeSeparator {
  border-bottom: solid #e5e5e5 1px;
  height: 0;
  margin: 5px 0;
}

.blocklyToolboxDiv[layout="h"] .blocklyTreeSeparator {
  border-right: solid #e5e5e5 1px;
  border-bottom: none;
  height: auto;
  margin: 0 5px 0 5px;
  padding: 5px 0;
  width: 0;
}
`);

registry.register(
    registry.Type.TOOLBOX_ITEM, ToolboxSeparator.registrationName,
    ToolboxSeparator);

export {ToolboxSeparator};
