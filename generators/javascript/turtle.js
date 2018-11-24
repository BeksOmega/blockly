Blockly.JavaScript['turtle_forward'] = function(block) {
  var value_forward = Blockly.JavaScript.valueToCode(block, 'FORWARD', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'turtle.forward(' + value_forward + ');\n';
  return code;
};

Blockly.JavaScript['turtle_right'] = function(block) {
  var value_right = Blockly.JavaScript.valueToCode(block, 'RIGHT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'turtle.right(' + value_right + ');\n';
  return code;
};

Blockly.JavaScript['turtle_left'] = function(block) {
  var value_left = Blockly.JavaScript.valueToCode(block, 'LEFT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'turtle.left(' + value_left + ');\n';
  return code;
};

Blockly.JavaScript['turtle_width'] = function(block) {
  var value_width = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'turtle.penWidth = ' + value_width + ';\n';
  return code;
};

Blockly.JavaScript['turtle_colour'] = function(block) {
  var value_colour = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'turtle.penStyle = ' + value_colour + ';\n';
  return code;
};

Blockly.JavaScript['turtle_getcolour'] = function(block) {
  var code = 'turtle.penStyle';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['turtle_getwidth'] = function(block) {
  var code = 'turtle.penWidth';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['turtle_savestate'] = function(block) {
  var code = 'turtle.save();\n';
  return code;
};

Blockly.JavaScript['turtle_restorestate'] = function(block) {
  var code = 'turtle.restore();\n';
  return code;
};

Blockly.JavaScript['turtle_clear'] = function(block) {
  var code = 'turtle.clear();\n';
  return code;
};

Blockly.JavaScript['turtle_penup'] = function(block) {
  var code = 'turtle.penUp();\n';
  return code;
};

Blockly.JavaScript['turtle_pendown'] = function(block) {
  var code = 'turtle.penDown();\n';
  return code;
};