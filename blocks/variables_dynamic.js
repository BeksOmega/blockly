/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @suppress {checkTypes}
 */
'use strict';

goog.module('Blockly.libraryBlocks.variablesDynamic');

/* eslint-disable-next-line no-unused-vars */
const AbstractEvent = goog.requireType('Blockly.Events.Abstract');
const ContextMenu = goog.require('Blockly.ContextMenu');
const Extensions = goog.require('Blockly.Extensions');
const Variables = goog.require('Blockly.Variables');
const xml = goog.require('Blockly.utils.xml');
/* eslint-disable-next-line no-unused-vars */
const {Block} = goog.requireType('Blockly.Block');
/* eslint-disable-next-line no-unused-vars */
const {BlockDefinition} = goog.requireType('Blockly.blocks');
const {Msg} = goog.require('Blockly.Msg');
const {createBlockDefinitionsFromJsonArray, defineBlocks} = goog.require('Blockly.common');
/** @suppress {extraRequire} */
goog.require('Blockly.FieldLabel');
/** @suppress {extraRequire} */
goog.require('Blockly.FieldVariable');


/**
 * A dictionary of the block definitions provided by this module.
 * @type {!Object<string, !BlockDefinition>}
 */
const blocks = createBlockDefinitionsFromJsonArray([
  // Block for variable getter.
  {
    'type': 'variables_get_dynamic',
    'message0': '%1',
    'args0': [{
      'type': 'field_variable',
      'name': 'VAR',
      'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
    }],
    'output': null,
    'style': 'variable_dynamic_blocks',
    'helpUrl': '%{BKY_VARIABLES_GET_HELPURL}',
    'tooltip': '%{BKY_VARIABLES_GET_TOOLTIP}',
    'extensions': ['contextMenu_variableDynamicSetterGetter'],
  },
  // Block for variable setter.
  {
    'type': 'variables_set_dynamic',
    'message0': '%{BKY_VARIABLES_SET}',
    'args0': [
      {
        'type': 'field_variable',
        'name': 'VAR',
        'variable': '%{BKY_VARIABLES_DEFAULT_NAME}',
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'variable_dynamic_blocks',
    'tooltip': '%{BKY_VARIABLES_SET_TOOLTIP}',
    'helpUrl': '%{BKY_VARIABLES_SET_HELPURL}',
    'extensions': ['contextMenu_variableDynamicSetterGetter'],
  },
]);
exports.blocks = blocks;

/**
 * Mixin to add context menu items to create getter/setter blocks for this
 * setter/getter.
 * Used by blocks 'variables_set_dynamic' and 'variables_get_dynamic'.
 * @mixin
 * @augments Block
 * @readonly
 */
const CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN = {
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this {Block}
   */
  customContextMenu: function(options) {
    // Getter blocks have the option to create a setter block, and vice versa.
    if (!this.isInFlyout) {
      this.addNonFlyoutOptions(options);
    } else if (this.type === 'variables_get_dynamic') {
      this.addFlyoutOptions(options);
    }
  },

  addFlyoutOptions(options) {
    const renameOption = {
      text: Msg['RENAME_VARIABLE'],
      enabled: true,
      callback: renameOptionCallbackFactory(this),
    };
    const name = this.getField('VAR').getText();
    const deleteOption = {
      text: Msg['DELETE_VARIABLE'].replace('%1', name),
      enabled: true,
      callback: deleteOptionCallbackFactory(this),
    };
    options.unshift(renameOption);
    options.unshift(deleteOption);
  },

  addNonFlyoutOptions(options) {
    const varModel = this.getField('VAR').getVariable();
    const oppositeType = this.type === 'variables_get_dynamic' ?
        'variables_set_dynamic' : 'variables_get_dynamic';
    const msg = this.type === 'variables_get_dynamic' ?
        Msg['VARIABLES_GET_CREATE_SET'] : Msg['VARIABLES_SET_CREATE_GET'];
    
    options.push({
      // TODO: Does this work, or does it need to be a function?
      enabled: () => this.workpace.remainingCapacity > 0,
      text: msg.replace('%1', varModel.name),
      callback: ContextMenu.callbackFactoryJson(
        this,
        {
          'type': oppositeType,
          'fields': {
            'VAR': {
              'id': varModel.getId(),
            },
          },
        },
      )});
  },

  /**
   * Called whenever anything on the workspace changes.
   * Set the connection type for this block.
   * @param {AbstractEvent} _e Change event.
   * @this {Block}
   */
  onchange: function(_e) {
    const id = this.getFieldValue('VAR');
    const variableModel = Variables.getVariable(this.workspace, id);
    if (this.type === 'variables_get_dynamic') {
      this.outputConnection.setCheck(variableModel.type);
    } else {
      this.getInput('VALUE').connection.setCheck(variableModel.type);
    }
  },
};

/**
 * Factory for callbacks for rename variable dropdown menu option
 * associated with a variable getter block.
 * @param {!Block} block The block with the variable to rename.
 * @return {!function()} A function that renames the variable.
 */
const renameOptionCallbackFactory = function(block) {
  return function() {
    const workspace = block.workspace;
    const variable = block.getField('VAR').getVariable();
    Variables.renameVariable(workspace, variable);
  };
};

/**
 * Factory for callbacks for delete variable dropdown menu option
 * associated with a variable getter block.
 * @param {!Block} block The block with the variable to delete.
 * @return {!function()} A function that deletes the variable.
 */
const deleteOptionCallbackFactory = function(block) {
  return function() {
    const workspace = block.workspace;
    const variable = block.getField('VAR').getVariable();
    workspace.deleteVariableById(variable.getId());
    workspace.refreshToolboxSelection();
  };
};

Extensions.registerMixin(
    'contextMenu_variableDynamicSetterGetter',
    CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN);

// Register provided blocks.
defineBlocks(blocks);
