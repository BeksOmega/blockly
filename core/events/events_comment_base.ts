/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Base class for comment events.
 */
'use strict';

/**
 * Base class for comment events.
 * @class
 */


import * as Xml from '../xml';
import * as eventUtils from './utils';
import * as utilsXml from '../utils/xml';
import {Abstract as AbstractEvent} from './events_abstract';
/* eslint-disable-next-line no-unused-vars */
import type {CommentCreate} from './events_comment_create';
/* eslint-disable-next-line no-unused-vars */
import type {CommentDelete} from './events_comment_delete';
/* eslint-disable-next-line no-unused-vars */
import type {WorkspaceComment} from '../workspace_comment';


/**
 * Abstract class for a comment event.
 * @extends {AbstractEvent}
 * @alias Blockly.Events.CommentBase
 */
class CommentBase extends AbstractEvent {
  /**
   * @param {!WorkspaceComment=} opt_comment The comment this event
   *     corresponds to.  Undefined for a blank event.
   */
  constructor(opt_comment) {
    super();
    /**
     * Whether or not an event is blank.
     * @type {boolean}
     */
    this.isBlank = typeof opt_comment === 'undefined';

    /**
     * The ID of the comment this event pertains to.
     * @type {string}
     */
    this.commentId = this.isBlank ? '' : opt_comment.id;

    /**
     * The workspace identifier for this event.
     * @type {string}
     */
    this.workspaceId = this.isBlank ? '' : opt_comment.workspace.id;

    /**
     * The event group id for the group this event belongs to. Groups define
     * events that should be treated as an single action from the user's
     * perspective, and should be undone together.
     * @type {string}
     */
    this.group = eventUtils.getGroup();

    /**
     * Sets whether the event should be added to the undo stack.
     * @type {boolean}
     */
    this.recordUndo = eventUtils.getRecordUndo();
  }

  /**
   * Encode the event as JSON.
   * @return {!Object} JSON representation.
   */
  toJson() {
    const json = super.toJson();
    if (this.commentId) {
      json['commentId'] = this.commentId;
    }
    return json;
  }

  /**
   * Decode the JSON event.
   * @param {!Object} json JSON representation.
   */
  fromJson(json) {
    super.fromJson(json);
    this.commentId = json['commentId'];
  }

  /**
   * Helper function for Comment[Create|Delete]
   * @param {!CommentCreate|!CommentDelete} event
   *     The event to run.
   * @param {boolean} create if True then Create, if False then Delete
   */
  static CommentCreateDeleteHelper(event, create) {
    const workspace = event.getEventWorkspace_();
    if (create) {
      const xmlElement = utilsXml.createElement('xml');
      xmlElement.appendChild(event.xml);
      Xml.domToWorkspace(xmlElement, workspace);
    } else {
      const comment = workspace.getCommentById(event.commentId);
      if (comment) {
        comment.dispose();
      } else {
        // Only complain about root-level block.
        console.warn(
            'Can\'t uncreate non-existent comment: ' + event.commentId);
      }
    }
  }
}

export {CommentBase};
