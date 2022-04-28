/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Class for comment change event.
 */
'use strict';

/**
 * Class for comment change event.
 * @class
 */


import * as eventUtils from './utils';
import * as registry from '../registry';
import {CommentBase} from './events_comment_base';
/* eslint-disable-next-line no-unused-vars */
import type {WorkspaceComment} from '../workspace_comment';


/**
 * Class for a comment change event.
 * @extends {CommentBase}
 * @alias Blockly.Events.CommentChange
 */
class CommentChange extends CommentBase {
  /**
   * @param {!WorkspaceComment=} opt_comment The comment that is being
   *     changed.  Undefined for a blank event.
   * @param {string=} opt_oldContents Previous contents of the comment.
   * @param {string=} opt_newContents New contents of the comment.
   */
  constructor(opt_comment, opt_oldContents, opt_newContents) {
    super(opt_comment);

    /**
     * Type of this event.
     * @type {string}
     */
    this.type = eventUtils.COMMENT_CHANGE;

    if (!opt_comment) {
      return;  // Blank event to be populated by fromJson.
    }

    /** @type {string} */
    this.oldContents_ =
        typeof opt_oldContents === 'undefined' ? '' : opt_oldContents;
    /** @type {string} */
    this.newContents_ =
        typeof opt_newContents === 'undefined' ? '' : opt_newContents;
  }

  /**
   * Encode the event as JSON.
   * @return {!Object} JSON representation.
   */
  toJson() {
    const json = super.toJson();
    json['oldContents'] = this.oldContents_;
    json['newContents'] = this.newContents_;
    return json;
  }

  /**
   * Decode the JSON event.
   * @param {!Object} json JSON representation.
   */
  fromJson(json) {
    super.fromJson(json);
    this.oldContents_ = json['oldContents'];
    this.newContents_ = json['newContents'];
  }

  /**
   * Does this event record any change of state?
   * @return {boolean} False if something changed.
   */
  isNull() {
    return this.oldContents_ === this.newContents_;
  }

  /**
   * Run a change event.
   * @param {boolean} forward True if run forward, false if run backward (undo).
   */
  run(forward) {
    const workspace = this.getEventWorkspace_();
    const comment = workspace.getCommentById(this.commentId);
    if (!comment) {
      console.warn('Can\'t change non-existent comment: ' + this.commentId);
      return;
    }
    const contents = forward ? this.newContents_ : this.oldContents_;

    comment.setContent(contents);
  }
}

registry.register(
    registry.Type.EVENT, eventUtils.COMMENT_CHANGE, CommentChange);

export {CommentChange};
