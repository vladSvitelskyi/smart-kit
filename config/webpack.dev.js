// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

const merge = require('webpack-merge');
const webpack = require('webpack');
const projectPaths = require('./project-paths');
const getClientEnvironment = require('./env');
const nunjucksWebpackPlugin = require('./plugins/webpack/nunjucks');
const { commonSettings, commonCssLoaders } = require('./webpack.common.js');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Current project theme
const currentTheme = process.env.THEME;

// All project themes folders arr
const themes = process.env.THEMES.length ? process.env.THEMES.split(',') : [];

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
          ...commonCssLoaders({ currentTheme, themes }),
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
    contentBase: projectPaths.appPublic,
    watchContentBase: true,
    publicPath: publicPath,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // Makes some environment variables available to the JS code
    new webpack.DefinePlugin(env.stringified),
    nunjucksWebpackPlugin(templateContext),
  ],
});