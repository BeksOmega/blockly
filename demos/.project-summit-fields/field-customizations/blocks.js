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
'use strict';

Blockly.defineBlocksWithJsonArray([
  {
    "type": "example_customization",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "field_image",
        "src": "field-customizations/rad.png",
        "width": 50,
        "height": 50,
        "alt": "*",
        "flipRtl": false
      },
      {
        "type": "field_label",
        "text": "Custom Fields Are Rad!",
        "class": "impactful-field-text"
      },
      {
        "type": "field_image",
        "src": "field-customizations/rad.png",
        "width": 50,
        "height": 50,
        "alt": "*",
        "flipRtl": false
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "example_blocks",
  },
]);
