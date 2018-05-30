// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

const merge = require('webpack-merge');
const webpack = require('webpack');
const projectPaths = require('./project-paths');
const getClientEnvironment = require('./env');
const NunjucksWebpackPlugin = require('./plugins/webpack/nunjucks');
const { commonSettings, commonCssLoaders } = require('./webpack.common.js');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = projectPaths.servedPath;

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Context for njk template
const templateContext = env.raw;

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
          ...commonCssLoaders,
        ],
      },
    ],
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
    new webpack.HotModuleReplacementPlugin(),
    // Makes some environment variables available to the JS code
    new webpack.DefinePlugin(env.stringified),
    NunjucksWebpackPlugin(templateContext),
  ],
});