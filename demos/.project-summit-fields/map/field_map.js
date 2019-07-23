/**
 * @license
 * Blockly User Summit 2019 Fields Demos
 *
 * Copyright 2019 Beka Westberg
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Map selector field.
 * @author bekawestberg@gmail.com
 */
'use strict';

goog.provide('Blockly.FieldMap');

goog.require('Blockly.Field');
goog.require('Blockly.utils');
goog.require('Blockly.utils.dom');

/**
 * Class for a field used to select a portion of a map.
 * @param {!string} mapSrc The src string for the map svg.
 * @param {!Object<string, string>} namesObj A map of ISO codes to names, or
 *    string table references. The ISO codes should also be the id's of objects
 *    in the SVG.
 * @param {string=} opt_value An ISO code. This country/subdivision will be
 *    selected.
 * @param {Function=} opt_validator A function that is called to validate
 *    changes to the field's value. Takes in an ISO code & returns a validated
 *    ISO code (that is available in the map), or null to abort the change.
 * @constructor
 */
Blockly.FieldMap = function(mapSrc, namesObj, opt_value, opt_validator) {
  this.mapSrc_ = mapSrc;
  this.createNamesDictionary_(namesObj);
  if (!opt_value) {
    opt_value = Object.values(this.namesDictionary_)[0];
  }

  Blockly.FieldMap.superClass_.constructor.call(this, opt_value, opt_validator);
};
goog.inherits(Blockly.FieldMap, Blockly.Field);

/**
 * Construct a FieldMap from a JSON arg object.
 * @param {!Object} options A JSON object with options.
 * @return {Blockly.FieldMap} The new field instance.
 */
Blockly.FieldMap.fromJson = function(options) {
  return new Blockly.FieldMap(
      options['mapSrc'], options['nameObj'], options['value']);
};

/**
 * Serializable fields are saved by the XML renderer, non-serializable fields
 * are not. Editable fields should also be serializable.
 * @type {boolean}
 * @const
 */
Blockly.FieldMap.prototype.SERIALIZABLE = true;

/**
 * Ensure that the input is a valid ISO code.
 * @param {string} newValue The input value.
 * @return {?string} The valid ISO code, or null if invalid.
 * @protected
 */
Blockly.FieldMap.prototype.doClassValidation_ = function(newValue) {
  if (!this.namesDictionary_[newValue]) {
    return null;
  }
  return newValue;
};

/**
 * Render the on-block display. And rerender the editor if it is open.
 * @protected
 */
Blockly.FieldMap.prototype.render_ = function() {
  Blockly.FieldMap.superClass_.render_.call(this);
  if (this.editor_) {
    this.renderEditor_();
  }
};

/**
 * Render the editor to show the selected region.
 * @private
 */
Blockly.FieldMap.prototype.renderEditor_ = function() {
  if (this.selectedSection_) {
    Blockly.utils.dom.removeClass(this.selectedSection_, 'selected');
  }
  this.selectedSection_ = this.docElement_.getElementById(this.getValue());
  Blockly.utils.dom.addClass(this.selectedSection_, 'selected');
};

/**
 * Get the text representation of the value of the field.
 * @return {string}
 */
Blockly.FieldMap.prototype.getText = function() {
  return this.namesDictionary_[this.getValue()];
};

/**
 * Get the text used for the on-block display.
 * @return {string}
 * @protected
 */
Blockly.FieldMap.prototype.getDisplayText_ = function() {
  return this.getText();
};

/**
 * Create the field's editor (i.e. the map).
 * @protected
 */
Blockly.FieldMap.prototype.showEditor_ = function() {
  this.editor_ = this.dropdownCreate_();
  this.editor_.addEventListener('load', function() {
    this.editorListeners_ = [];

    var doc = this.editor_.contentDocument || this.editor_.getSVGDocument();
    this.docElement_ = doc.documentElement;
    this.editorListeners_.push(Blockly.bindEvent_(
      this.docElement_, 'mouseup', this, this.onSubsectionClick_));

    var subsections = this.docElement_.querySelectorAll('path');
    for (var i = 0, section; section = subsections[i]; i++) {
      Blockly.utils.dom.addClass(section, 'section');
      this.editorListeners_.push(Blockly.bindEvent_(
          section, 'mousemove', this, this.onSubsectionHover_));
    }
    this.renderEditor_();
  }.bind(this));
  Blockly.DropDownDiv.getContentDiv().appendChild(this.editor_);

  Blockly.DropDownDiv.setColour('white', 'silver');
  Blockly.DropDownDiv.showPositionedByField(
      this, this.dropdownDispose_.bind(this));
};

/**
 * Create the dom of the dropdown editor.
 * @return {HTMLObjectElement}
 * @private
 */
Blockly.FieldMap.prototype.dropdownCreate_ = function() {
  var map = document.createElement('object');
  map.setAttribute('data', this.mapSrc_);
  map.setAttribute('type', 'image/svg+xml');
  map.setAttribute('width', 250);
  map.setAttribute('height', 250);

  return map;
};

/**
 * Dispose of all listeners bound to the editor, and all dom references that
 * have been removed.
 * @private
 */
Blockly.FieldMap.prototype.dropdownDispose_ = function() {
  for (var i = this.editorListeners_.length, listener;
       listener = this.editorListeners_[i]; i--) {
    Blockly.unbindEvent_(listener);
    this.editorListeners_.pop();
  }

  this.editor_ = null;
};

/**
 * Function for handling a click on a subsection of the map.
 * @param {Event} event A click event.
 * @private
 */
Blockly.FieldMap.prototype.onSubsectionClick_ = function(event) {
  var id = event.target.id;
  // Make sure it's actually a country.
  if (id.length == 2) {
    this.setValue(id);
  }
};

/**
 * Function for handling a move over the map.
 * @param {Event} event A move event.
 * @private
 */
Blockly.FieldMap.prototype.onSubsectionHover_ = function(event) {
  if (this.target_) {
    Blockly.utils.dom.removeClass(this.target_, 'hovered');
  }
  this.target_ = event.target;
  Blockly.utils.dom.addClass(this.target_, 'hovered');
};

/**
 * Create the map of language-neutral ISO keys to human-readable region names.
 * @param {!Object<string, string>} namesObj A map of ISO keys to
 *    human-readable region names, or string table references.
 * @private
 */
Blockly.FieldMap.prototype.createNamesDictionary_ = function(namesObj) {
  this.namesDictionary_ = Object.create(null);
  var keys = Object.keys(namesObj);
  for(var i = 0, key; key = keys[i]; i++) {
    // Get translated country/county/state/etc names.
    this.namesDictionary_[key] =
        Blockly.utils.replaceMessageReferences(namesObj[key]);
  }
};

Blockly.Field.register('field_map', Blockly.FieldMap);
