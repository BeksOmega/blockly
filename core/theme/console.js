/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2019 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Console theme.
 * @author samelh@google.com (Sam El-Husseini)
 */
'use strict';

goog.provide('Blockly.Themes.Console');

goog.require('Blockly.Theme');


// Temporary holding object.
Blockly.Themes.Console = {};

Blockly.Themes.Console.defaultBlockStyles = {
  "colour_blocks": {
    /*"colourPrimary": "#a5745b",
    "colourSecondary": "#dbc7bd",
    "colourTertiary": "#845d49"*/
    "colourPrimary": "#99471F",
    "colourSecondary": "#E6A17E",
    "colourTertiary": "#CC5F29"
  },
  "list_blocks": {
    /*"colourPrimary": "#745ba5",
    "colourSecondary": "#c7bddb",
    "colourTertiary": "#5d4984"*/
    "colourPrimary": "#471F99",
    "colourSecondary": "#A17EE6",
    "colourTertiary": "#5F29CC"
  },
  "logic_blocks": {
    /*"colourPrimary": "#5b80a5",
    "colourSecondary": "#bdccdb",
    "colourTertiary": "#496684"*/
    "colourPrimary": "#1F5C99",
    "colourSecondary": "#7EB2E6",
    "colourTertiary": "#2978CC"
  },
  "loop_blocks": {
    /*"colourPrimary": "#5ba55b",
    "colourSecondary": "#bddbbd",
    "colourTertiary": "#498449"*/
    "colourPrimary": "#1F991F",
    "colourSecondary": "#7EE67E",
    "colourTertiary": "#29CC29"
  },
  "math_blocks": {
    /*"colourPrimary": "#5b67a5",
    "colourSecondary": "#bdc2db",
    "colourTertiary": "#495284"*/
    "colourPrimary": "#1F3399",
    "colourSecondary": "#7E8FE6",
    "colourTertiary": "#2944CC"
  },
  "procedure_blocks": {
   /* "colourPrimary": "#995ba5",
    "colourSecondary": "#d6bddb",
    "colourTertiary": "#7a4984"*/
    "colourPrimary": "#851F99",
    "colourSecondary": "#D47EE6",
    "colourTertiary": "#B129CC"
  },
  "text_blocks": {
   /* "colourPrimary": "#5ba58c",
    "colourSecondary": "#bddbd1",
    "colourTertiary": "#498470"*/
    "colourPrimary": "#1F9970",
    "colourSecondary": "#7EE6C3",
    "colourTertiary": "#29CC96"
  },
  "variable_blocks": {
    /*"colourPrimary": "#a55b99",
    "colourSecondary": "#dbbdd6",
    "colourTertiary": "#84497a"*/
    "colourPrimary": "#991F85",
    "colourSecondary": "#E67ED4",
    "colourTertiary": "#CC29B1"
  },
  "variable_dynamic_blocks": {
    /*"colourPrimary": "#a55b99",
    "colourSecondary": "#dbbdd6",
    "colourTertiary": "#84497a"*/
    "colourPrimary": "#991F85",
    "colourSecondary": "#E67ED4",
    "colourTertiary": "#CC29B1"
  },
};

Blockly.Themes.Console.categoryStyles = {
  "colour_category": {
    "colour": "#a5745b"
  },
  "list_category": {
    "colour": "#745ba5"
  },
  "logic_category": {
    "colour": "#5b80a5"
  },
  "loop_category": {
    "colour": "#5ba55b"
  },
  "math_category": {
    "colour": "#5b67a5"
  },
  "procedure_category": {
    "colour": "#995ba5"
  },
  "text_category": {
    "colour": "#5ba58c"
  },
  "variable_category": {
    "colour": "#a55b99"
  },
  "variable_dynamic_category": {
    "colour": "#a55b99"
  }
};

// This style is still being fleshed out and may change.
Blockly.Themes.Console =
    new Blockly.Theme(Blockly.Themes.Console.defaultBlockStyles,
        Blockly.Themes.Console.categoryStyles);

Blockly.Themes.Console.setComponentStyle('workspace', '#1e1e1e');
Blockly.Themes.Console.setComponentStyle('toolbox', '#333');
Blockly.Themes.Console.setComponentStyle('toolboxText', '#fff');
Blockly.Themes.Console.setComponentStyle('flyout', '#252526');
Blockly.Themes.Console.setComponentStyle('flyoutText', '#ccc');
Blockly.Themes.Console.setComponentStyle('flyoutOpacity', 1);
Blockly.Themes.Console.setComponentStyle('scrollbar', '#797979');
Blockly.Themes.Console.setComponentStyle('scrollbarOpacity', 0.4);
