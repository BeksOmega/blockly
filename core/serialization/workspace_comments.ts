/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ISerializer} from '../interfaces/i_serializer.js';
import {Workspace} from '../workspace.js';
import {WorkspaceSvg} from '../workspace_svg.js';
import * as priorities from './priorities.js';
import {WorkspaceComment} from '../comments/workspace_comment.js';
import {RenderedWorkspaceComment} from '../comments/rendered_workspace_comment.js';
import * as eventUtils from '../events/utils.js';
import {Coordinate} from '../utils/coordinate.js';
import * as serializationRegistry from './registry.js';

export interface State {
  id?: string;
  text?: string;
  location?: {x: number; y: number};
  size?: {height: number; width: number};
  collapsed?: boolean;
  editable?: boolean;
  movable?: boolean;
  deletable?: boolean;
}

export function save(
  comment: WorkspaceComment,
  {
    addCoordinates = false,
    saveIds = true,
  }: {
    addCoordinates?: boolean;
    saveIds?: boolean;
  } = {},
): State {
  const state: State = Object.create(null);

  state.size = comment.getSize();

  if (saveIds) state.id = comment.id;
  if (addCoordinates) state.location = comment.getRelativetoSurfaceXY();

  if (comment.getText()) state.text = comment.getText();
  if (comment.isCollapsed()) state.collapsed = true;
  if (!comment.isOwnEditable()) state.editable = false;
  if (!comment.isOwnMovable()) state.movable = false;
  if (!comment.isOwnDeletable()) state.deletable = false;

  return state;
}

export function append(
  state: State,
  workspace: Workspace,
  {recordUndo = false}: {recordUndo?: boolean} = {},
): WorkspaceComment {
  const prevRecordUndo = eventUtils.getRecordUndo();
  eventUtils.setRecordUndo(recordUndo);

  const comment =
    workspace instanceof WorkspaceSvg
      ? new RenderedWorkspaceComment(workspace, state.id)
      : new WorkspaceComment(workspace, state.id);

  if (state.text !== undefined) comment.setText(state.text);
  if (state.location !== undefined) {
    comment.moveTo(new Coordinate(state.location.x, state.location.y));
  }
  if (state.size !== undefined) comment.setSize(state.size);
  if (state.collapsed !== undefined) comment.setCollapsed(state.collapsed);
  if (state.editable !== undefined) comment.setEditable(state.editable);
  if (state.movable !== undefined) comment.setMovable(state.movable);
  if (state.deletable !== undefined) comment.setDeletable(state.deletable);

  eventUtils.setRecordUndo(prevRecordUndo);

  return comment;
}

// Alias to disambiguate saving within the serializer.
const saveComment = save;

export class WorkspaceCommentSerializer implements ISerializer {
  priority = priorities.WORKSPACE_COMMENTS;

  save(workspace: Workspace): State[] | null {
    const commentStates = [];
    for (const comment of workspace.getTopComments()) {
      const state = saveComment(comment as AnyDuringMigration, {
        addCoordinates: true,
        saveIds: true,
      });
      if (state) commentStates.push(state);
    }
    return commentStates.length ? commentStates : null;
  }

  load(state: State[], workspace: Workspace) {
    for (const commentState of state) {
      append(commentState, workspace, {recordUndo: eventUtils.getRecordUndo()});
    }
  }

  clear(workspace: Workspace) {
    for (const comment of workspace.getTopComments()) {
      comment.dispose();
    }
  }
}

serializationRegistry.register(
  'workspaceComments',
  new WorkspaceCommentSerializer(),
);
