/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

goog.declareModuleId('Blockly.test.eventProcedureEnable');

import {sharedTestSetup, sharedTestTeardown} from './test_helpers/setup_teardown.js';


suite('Procedure Enable Event', function() {
  setup(function() {
    sharedTestSetup.call(this);
    this.workspace = new Blockly.Workspace();
  });

  teardown(function() {
    sharedTestTeardown.call(this);
  });

  suite('running', function() {
    suite('forward', function() {
      test('the procedure with the matching ID is toggled', function() {
  
      });
  
      test('toggling a procedure fires an enable event', function() {
  
      });
  
      test('noop toggles do not fire enable events', function() {
  
      });
  
      test(
          'attempting to toggle a procedure that does not exist throws',
          function() {
  
          });
    });
  
    suite('backward', function() {
      test('the procedure with the matching ID is toggled', function() {
  
      });
  
      test('toggling a procedure fires an enable event', function() {
  
      });
  
      test('noop toggles do not fire enable events', function() {
  
      });
  
      test(
          'attempting to toggle a procedure that does not exist throws',
          function() {
  
          });
    });
  });
});
