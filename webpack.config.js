const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './core/blockly.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './'),
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new ClosurePlugin({
  //       mode: 'AGGRESSIVE_BUNDLE',
  //     }, { }),
  //   ],
  //   splitChunks: {
  //     minSize: 0,
  //   },
  //   concatenateModules: false,
  // },
  plugins: [
    new ClosurePlugin({
      mode: 'AGGRESSIVE_BUNDLE',
      closureLibraryBase: path.resolve(__dirname, 'closure/goog/base.js'),
      deps: [
        path.resolve(__dirname, 'tests/deps.js'),
      ],
    }),
    // new ClosurePlugin.LibraryPlugin({
    //   closureLibraryBase: path.resolve(__dirname, 'closure/goog/base.js'),
    //   deps: [
    //     path.resolve(__dirname, 'tests/deps.js'),
    //   ],
    // }),
  ],
};
