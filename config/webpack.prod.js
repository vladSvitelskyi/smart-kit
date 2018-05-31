// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nunjucksWebpackPlugin = require('./plugins/webpack/nunjucks');
const { commonSettings, commonCssLoaders } = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
const projectPaths = require('./project-paths');
const getClientEnvironment = require('./env');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = projectPaths.servedPath;

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Current project theme
const currentTheme = process.env.THEME;

// All project themes folders arr
const themes = process.env.THEMES.length ? process.env.THEMES.split(',') : [];

// Context for njk template
const templateContext = env.raw;

// Note: defined here because it will be used more than once.
const cssFilename = `css/[name]${currentTheme ? '.' + currentTheme : '' }.css`;

module.exports = merge.smart(commonSettings, {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: publicPath,
  },
  stats: 'normal',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          ...commonCssLoaders({ currentTheme, themes }),
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'main',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    // Makes some environment variables available to the JS code
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: cssFilename,
    }),
    new CopyWebpackPlugin([{ from: projectPaths.appPublic, to: projectPaths.appBuild }]),
    nunjucksWebpackPlugin(templateContext),
  ],
});