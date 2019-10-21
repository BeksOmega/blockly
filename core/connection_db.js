/**
 * @license
 * Copyright 2011 Google LLC
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
 * @fileoverview A database of all the rendered connections that could
 *    possibly be connected to (i.e. not collapsed, etc).
 *    Sorted by y coordinate.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.ConnectionDB');

goog.require('Blockly.RenderedConnection');


/**
 * Database of connections.
 * Connections are stored in order of their vertical component.  This way
 * connections in an area may be looked up quickly using a binary search.
 * @constructor
 */
Blockly.ConnectionDB = function() {
  /**
   * Array of connections sorted by y position in workspace units.
   * @type {!Array.<!Blockly.RenderedConnection>}
   * @private
   */
  this.connections_ = [];
};

/**
 * Add a connection to the database. Should not already exist in the database.
 * @param {!Blockly.RenderedConnection} connection The connection to be added.
 * @package
 */
Blockly.ConnectionDB.prototype.addConnection = function(connection) {
  var pos = connection.getRelativeToSurfaceXY();
  var index = this.calculateIndexForYPos_(pos.y);
  this.connections_.splice(index, 0, connection);
};

/**
 * Finds the index of the given connection.
 *
 * Starts by doing a binary search to find the approximate location, then
 * linearly searches nearby for the exact connection.
 * @param {!Blockly.RenderedConnection} conn The connection to find.
 * @return {number} The index of the connection, or -1 if the connection was
 *     not found.
 * @private
 */
Blockly.ConnectionDB.prototype.findIndexOfConnection_ = function(conn) {
  if (!this.connections_.length) {
    return -1;
  }

  var yPos = conn.getRelativeToSurfaceXY().y;
  var bestGuess = this.calculateIndexForYPos_(yPos);
  if (bestGuess >= this.connections_.length) {
    // Not in list
    return -1;
  }

  // Walk forward and back on the y axis looking for the connection.
  var db = this.connections_;
  var pointerMin = bestGuess;
  var pointerMax = bestGuess;
  while (pointerMin >= 0 && db[pointerMin].getRelativeToSurfaceXY().y == yPos) {
    if (db[pointerMin] == conn) {
      return pointerMin;
    }
    pointerMin--;
  }

  var length = db.length;
  while (pointerMax < length &&
      db[pointerMax].getRelativeToSurfaceXY().y == yPos) {
    if (db[pointerMax] == conn) {
      return pointerMax;
    }
    pointerMax++;
  }
  return -1;
};

/**
 * Finds the correct index for the given y position.
 * @param {number} yPos The y position used to decide where to
 *    insert the connection.
 * @return {number} The candidate index.
 * @private
 */
Blockly.ConnectionDB.prototype.calculateIndexForYPos_ = function(yPos) {
  if (!this.connections_.length) {
    return 0;
  }
  var db = this.connections_;
  var pointerMin = 0;
  var pointerMax = this.connections_.length;
  while (pointerMin < pointerMax) {
    var pointerMid = Math.floor((pointerMin + pointerMax) / 2);
    var connY = db[pointerMid].getRelativeToSurfaceXY().y;
    if (connY < yPos) {
      pointerMin = pointerMid + 1;
    } else if (connY > yPos) {
      pointerMax = pointerMid;
    } else {
      pointerMin = pointerMid;
      break;
    }
  }
  return pointerMin;
};

/**
 * Remove a connection from the database.  Must already exist in DB.
 * @param {!Blockly.RenderedConnection} connection The connection to be removed.
 * @throws {Error} If the connection cannot be found in the database.
 */
Blockly.ConnectionDB.prototype.removeConnection = function(connection) {
  var index = this.findIndexOfConnection_(connection);
  if (index == -1) {
    throw Error('Unable to find connection in connectionDB.');
  }
  this.connections_.splice(index, 1);
};

/**
 * Find all nearby connections to the given connection.
 * Type checking does not apply, since this function is used for bumping.
 * @param {!Blockly.RenderedConnection} connection The connection whose
 *     neighbours should be returned.
 * @param {number} maxRadius The maximum radius to another connection.
 * @return {!Array.<!Blockly.RenderedConnection>} List of connections.
 */
Blockly.ConnectionDB.prototype.getNeighbours = function(connection, maxRadius) {
  var db = this.connections_;
  var currentPos = connection.getRelativeToSurfaceXY();

  // Binary search to find the closest y location.
  var pointerMin = 0;
  var pointerMax = db.length - 2;
  var pointerMid = pointerMax;
  while (pointerMin < pointerMid) {
    var connY = db[pointerMid].getRelativeToSurfaceXY().y;
    if (connY < currentPos.y) {
      pointerMin = pointerMid;
    } else {
      pointerMax = pointerMid;
    }
    pointerMid = Math.floor((pointerMin + pointerMax) / 2);
  }

  var neighbours = [];
  /**
   * Computes if the current connection is within the allowed radius of another
   * connection.
   * This function is a closure and has access to outside variables.
   * @param {number} yIndex The other connection's index in the database.
   * @return {boolean} True if the current connection's vertical distance from
   *     the other connection is less than the allowed radius.
   */
  function checkConnection_(yIndex) {
    var otherConn = db[yIndex];
    var distance = connection.distanceFrom(otherConn);
    if (distance <= maxRadius) {
      neighbours.push(db[yIndex]);
    }
    var delta = Blockly.utils.Coordinate.difference(
        otherConn.getRelativeToSurfaceXY(),
        currentPos);
    return delta.y < maxRadius;
  }

  // Walk forward and back on the y axis looking for the closest x,y point.
  pointerMin = pointerMid;
  pointerMax = pointerMid;
  if (db.length) {
    while (pointerMin >= 0 && checkConnection_(pointerMin)) {
      pointerMin--;
    }
    do {
      pointerMax++;
    } while (pointerMax < db.length && checkConnection_(pointerMax));
  }

  return neighbours;
};

/**
 * Is the candidate connection close to the reference connection.
 * Extremely fast; only looks at Y distance.
 * @param {number} index Index in database of candidate connection.
 * @param {number} baseY Reference connection's Y value.
 * @param {number} maxRadius The maximum radius to another connection.
 * @return {boolean} True if connection is in range.
 * @private
 */
Blockly.ConnectionDB.prototype.isInYRange_ = function(index, baseY, maxRadius) {
  var yDistance = Math.abs(
      this.connections_[index].getRelativeToSurfaceXY().y - baseY);
  return yDistance <= maxRadius;
};

/**
 * Find the closest compatible connection to this connection.
 * @param {!Blockly.RenderedConnection} conn The connection searching for a compatible
 *     mate.
 * @param {number} maxRadius The maximum radius to another connection.
 * @param {!Blockly.utils.Coordinate} dxy Offset between this connection's
 *     location in the database and the current location (as a result of
 *     dragging).
 * @return {!{connection: Blockly.RenderedConnection, radius: number}}
 *     Contains two properties: 'connection' which is either another
 *     connection or null, and 'radius' which is the distance.
 */
Blockly.ConnectionDB.prototype.searchForClosest = function(conn, maxRadius,
    dxy) {
  if (!this.connections_.length) {
    // Don't bother.
    return {connection: null, radius: maxRadius};
  }

  var movedPosition = Blockly.utils.Coordinate.sum(
      conn.getRelativeToSurfaceXY(), dxy);

  // calculateIndexForYPos_ finds an index for insertion, which is always
  // after any block with the same y index.  We want to search both forward
  // and back, so search on both sides of the index.
  var closestIndex = this.calculateIndexForYPos_(movedPosition.y);

  var bestConnection = null;
  var bestRadius = maxRadius;
  var temp;

  // Walk forward and back on the y axis looking for the closest x,y point.
  var pointerMin = closestIndex - 1;
  while (pointerMin >= 0 &&
      this.isInYRange_(pointerMin, movedPosition.y, maxRadius)) {
    temp = this.connections_[pointerMin];
    if (conn.isConnectionAllowed(temp, bestRadius)) {
      bestConnection = temp;
      bestRadius = temp.distanceFrom(conn);
    }
    pointerMin--;
  }

  var pointerMax = closestIndex;
  while (pointerMax < this.connections_.length &&
      this.isInYRange_(pointerMax, movedPosition.y, maxRadius)) {
    temp = this.connections_[pointerMax];
    if (conn.isConnectionAllowed(temp, bestRadius)) {
      bestConnection = temp;
      bestRadius = temp.distanceFrom(conn);
    }
    pointerMax++;
  }

  // If there were no valid connections, bestConnection will be null.
  return {connection: bestConnection, radius: bestRadius};
};

/**
 * Initialize a set of connection DBs for a workspace.
 * @return {!Array.<!Blockly.ConnectionDB>} Array of databases.
 */
Blockly.ConnectionDB.init = function() {
  // Create four databases, one for each connection type.
  var dbList = [];
  dbList[Blockly.INPUT_VALUE] = new Blockly.ConnectionDB();
  dbList[Blockly.OUTPUT_VALUE] = new Blockly.ConnectionDB();
  dbList[Blockly.NEXT_STATEMENT] = new Blockly.ConnectionDB();
  dbList[Blockly.PREVIOUS_STATEMENT] = new Blockly.ConnectionDB();
  return dbList;
};
