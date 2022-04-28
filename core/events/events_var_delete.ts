/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Classes for all types of variable events.
 */
'use strict';

/**
 * Classes for all types of variable events.
 * @class
 */


import * as eventUtils from './utils';
import * as registry from '../registry';
import {VarBase} from './events_var_base';
/* eslint-disable-next-line no-unused-vars */
import type {VariableModel} from '../variable_model';


/**
 * Class for a variable deletion event.
 * @extends {VarBase}
 * @alias Blockly.Events.VarDelete
 */
class VarDelete extends VarBase {
  /**
   * @param {!VariableModel=} opt_variable The deleted variable. Undefined
   *     for a blank event.
   */
  constructor(opt_variable) {
    super(opt_variable);

    /**
     * Type of this event.
     * @type {string}
     */
    this.type = eventUtils.VAR_DELETE;

    if (!opt_variable) {
      return;  // Blank event to be populated by fromJson.
    }

    /** @type {string} */
    this.varType = opt_variable.type;
    /** @type {string} */
    this.varName = opt_variable.name;
  }

  /**
   * Encode the event as JSON.
   * @return {!Object} JSON representation.
   */
  toJson() {
    const json = super.toJson();
    json['varType'] = this.varType;
    json['varName'] = this.varName;
    return json;
  }

  /**
   * Decode the JSON event.
   * @param {!Object} json JSON representation.
   */
  fromJson(json) {
    super.fromJson(json);
    this.varType = json['varType'];
    this.varName = json['varName'];
  }

  /**
   * Run a variable deletion event.
   * @param {boolean} forward True if run forward, false if run backward (undo).
   */
  run(forward) {
    const workspace = this.getEventWorkspace_();
    if (forward) {
      workspace.deleteVariableById(this.varId);
    } else {
      workspace.createVariable(this.varName, this.varType, this.varId);
    }
  }
}

registry.register(registry.Type.EVENT, eventUtils.VAR_DELETE, VarDelete);

export {VarDelete};
