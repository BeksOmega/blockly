const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './core/blockly.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // optimization: {
  //   minimizer: [
  //     new ClosurePlugin({mode: 'AGGRESSIVE_BUNDLE'}),
  //   ],
  // },
  plugins: [
    new ClosurePlugin.LibraryPlugin({
      closureLibraryBase: path.resolve(__dirname, 'closure/goog/base.js'),
      deps: [path.resolve(__dirname, 'tests/deps.js')],
    }),
  ],
};
