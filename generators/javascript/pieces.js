Blockly.JavaScript['piece_start'] = function(block) {
  var statements_start_list = Blockly.JavaScript
    .statementToCode(block, 'START_LIST');
  var value_iterations = Blockly.JavaScript
    .valueToCode(block, 'ITERATIONS', Blockly.JavaScript.ORDER_ATOMIC);
  var blocks = block.workspace.getTopBlocks();
  var replacersCode = '';
  var drawersCode = '';
  for(var i =0, checkBlock; checkBlock = blocks[i]; i++) {
    if (checkBlock == block) {
      continue;
    }
    if (checkBlock.type == 'piece_replace') {
      if (replacersCode) {
        replacersCode += ',\n';
      }
      replacersCode += Blockly.JavaScript.variableDB_.getName(
          checkBlock.getFieldValue('PIECE_NAME'),
          Blockly.VARIABLE_CATEGORY_NAME) +
          ': ' +
          Blockly.JavaScript.blockToCode(checkBlock);
    } else if (checkBlock.type == 'piece_draw') {
      if (drawersCode) {
        drawersCode += ',\n';
      }
      drawersCode += Blockly.JavaScript.variableDB_.getName(
          checkBlock.getFieldValue('PIECE_NAME'),
          Blockly.VARIABLE_CATEGORY_NAME) +
          ': ' +
          Blockly.JavaScript.blockToCode(checkBlock);
    }
  }

  var code = 'var replacersDictionary = {\n' + replacersCode + '\n}\n' +
    'var drawersDictionary = {\n' + drawersCode + '\n}\n' +
    'var pieceList = [];\n' + statements_start_list +
    'var iterations = Math.round(' + value_iterations + ');\n' +
      'for (var i = 0; i < iterations; i++) {\n' +
      '  var oldPieceList = [].concat(pieceList);\n' +
      '  pieceList = [];\n' +
      '  for (var j = 0, piece; piece = oldPieceList[j]; j++) {\n' +
      '    if (replacersDictionary[piece.name]) {\n' +
      '      replacersDictionary[piece.name](piece, pieceList);\n' +
      '    } else {\n' +
      '      pieceList.push(piece);\n' +
      '    }\n' +
      '  }\n' +
      '}\n\n' +
      'for (var i = 0, piece; piece = pieceList[i]; i++) {\n' +
      '  if (drawersDictionary[piece.name]) {\n' +
      '    drawersDictionary[piece.name](piece);\n' +
      '  }\n' +
      '}\n';
  return code;
};

Blockly.JavaScript['piece_replace'] = function(block) {
  var statements_replace = Blockly.JavaScript.statementToCode(block, 'REPLACE');
  if (statements_replace == '') {
    statements_replace = 'pieceList.push(piece);\n';
  }
  var code = 'function (piece, pieceList) {\n' + statements_replace + '}\n';
  return code;
};

Blockly.JavaScript['piece_draw'] = function(block) {
  var statements_draw = Blockly.JavaScript.statementToCode(block, 'DRAW');
  var code = 'function (piece) {\n' + statements_draw + '}\n';
  return code;
};

Blockly.JavaScript['piece_property'] = function(block) {
  var propertyName = block.getFieldValue('NAME');
  var code = 'piece.' + propertyName;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['piece_object'] = function(block) {
  var pieceName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('PIECE_NAME'),
      Blockly.VARIABLE_CATEGORY_NAME);
  var i = 0;
  var code = 'pieceList.push({name: "' + pieceName + '"';
  while (block.getInput('PROPERTY_INPUT' + i)) {
    var propertyName = block.getFieldValue('PROPERTY_NAME' + i);
    var propertyValue = Blockly.JavaScript.valueToCode(block, 'PROPERTY_INPUT' + i, Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    code += ', ' + propertyName + ' ' + propertyValue;
    i++;
  }
  code += '});\n';
  return code;
};
