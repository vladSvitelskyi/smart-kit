const merge = require('webpack-merge');
const webpack = require('webpack');
const projectPaths = require('./project-paths');
const { commonSettings, commonCssLoaders } = require('./webpack.common.js');

const publicPath = projectPaths.servedPath;

module.exports = merge.smart(commonSettings, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          ...commonCssLoaders
        ]
      },
    ]
  },
  devServer: {
    open: true,
    overlay: true,
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    contentBase: projectPaths.appBuild,
    publicPath: publicPath,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
});