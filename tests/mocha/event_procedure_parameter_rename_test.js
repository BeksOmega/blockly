/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

goog.declareModuleId('Blockly.test.eventProcedureParameterRename');

import {sharedTestSetup, sharedTestTeardown} from './test_helpers/setup_teardown.js';


suite('Procedure Parameter Rename Event', function() {
  setup(function() {
    sharedTestSetup.call(this);
    this.workspace = new Blockly.Workspace();
  });

  teardown(function() {
    sharedTestTeardown.call(this);
  });

  suite('running', function() {
    suite('forward', function() {
      test('the parameter with the matching ID and index is renamed', function() {
  
      });
  
      test('renaming a parameter fires a rename event', function() {
  
      });
  
      test('noop renames do not fire rename events', function() {
  
      });
  
      test(
          'attempting to rename a parameter that does not exist throws',
          function() {
  
          });
    });
  
    suite('backward', function() {
      test('the parameter with the matching ID and index is renamed', function() {
  
      });
  
      test('renaming a parameter fires a rename event', function() {
  
      });
  
      test('noop renames do not fire rename events', function() {
  
      });
  
      test(
          'attempting to rename a parameter that does not exist throws',
          function() {
  
          });
    });
  });
});
