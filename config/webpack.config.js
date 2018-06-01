// Get props from node
const argv = require('minimist')(process.argv.slice(2));

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = argv.mode || 'development';

// Set to determine is build rin in Production Mode
const IS_PROD = process.env.NODE_ENV === 'production';

// Common dependancies
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const getClientEnvironment = require('./env');
const projectPaths = require('./project-paths');

// Common Plugins
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const nunjucksWebpackPlugin = require('./plugins/webpack/nunjucks');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

// Prod Plugins
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// In development, we always serve from the root. This makes config easier.
const publicPath = IS_PROD ? projectPaths.servedPath : '/';

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = IS_PROD ? publicPath.slice(0, -1) : '';

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Current project theme
const currentTheme = process.env.THEME;

// All project themes folders arr
const themes = process.env.THEMES.length ? process.env.THEMES.split(',') : [];

// Context for njk template
const templateContext = env.raw;

// Note: defined here because it will be used more than once.
const cssFilename = `static/css/[name]${currentTheme ? '.' + currentTheme : '' }.css`;

// Webpack plugins splitted by [common/development/production]
const webpackPlugins = {
  common: [
    new CaseSensitivePathsPlugin(),
    new CleanWebpackPlugin(projectPaths.appBuild, {
      verbose: true,
      root: projectPaths.appRoot,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.DefinePlugin(env.stringified),
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: ['**/*.scss'],
      formatter: require('stylelint-formatter-pretty'),
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    ...nunjucksWebpackPlugin(templateContext),
  ],
  development: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  production: [
    new MiniCssExtractPlugin({
      filename: cssFilename,
    }),
    new CopyWebpackPlugin([{ from: projectPaths.appPublic, to: projectPaths.appBuild }]),
  ],
};

const cssLoaders = {
  common: [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('./plugins/postcss-at-theme')({
            current: currentTheme,
            themes: themes,
          }),
          require('postcss-combine-duplicated-selectors')({
            removeDuplicatedProperties: true,
          }),
          require('postcss-flexbugs-fixes'),
          require('postcss-pseudoelements'),
          autoprefixer({
            remove: false,
            browsers: [
              '>1%',
              'last 10 versions',
              'Firefox > 54',
              'Chrome > 59',
              'not Edge < 12',
              'not ie < 11',
            ],
            flexbox: 'no-2009',
          }),
        ],
      },
    },
    'sass-loader',
  ],
  development: [
    'style-loader',
  ],
  production: [
    MiniCssExtractPlugin.loader,
  ],
};

const buildSettins = {
  mode: env.raw.NODE_ENV,
  devtool: IS_PROD ? false : 'eval-source-map',
  entry: {
    main: projectPaths.appIndexJs,
  },
  output: {
    path: projectPaths.appBuild,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: publicPath,
  },
  resolve: {
    extensions: ['.js', '.json', '.njk'],
    alias: {
      modernizr$: projectPaths.modernizrSettings,
    },
  },
  stats: 'normal',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: projectPaths.appSrc,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-pretty'),
        },
      },
      {
        oneOf: [
          {
            test: /\.js$/,
            include: projectPaths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
            },
          },
          {
            test: /\.modernizrrc.js$/,
            use: ['modernizr-loader'],
          },
          {
            test: /\.modernizrrc(\.json)?$/,
            use: ['modernizr-loader', 'json-loader'],
          },
          {
            test: /\.(scss$|css$)$/,
            use: [...cssLoaders[env.raw.NODE_ENV], ...cssLoaders.common],
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: 'url-loader',
            options: {
              fallback: 'responsive-loader',
              quality: 40,
              limit: 7000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /.(ttf|otf|eot|webfont.svg|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [{
              loader: 'file-loader',
              options: {
                name: 'static/fonts/[name].[ext]',
              },
            }],
          },
          {
            loader: 'file-loader',
            exclude: [/\.js$/, /\.html$/, /\.scss/, /\.json$/, /\.njk$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.njk$/,
            use: [
              {
                loader: 'nunjucks-loader',
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [...webpackPlugins.common, ...webpackPlugins[env.raw.NODE_ENV]],
};

// Apply optimization for production build to JS & CSS
if (IS_PROD) {
  buildSettins.optimization = {
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
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  }
} else {
  // Configule dev server for dev mode
  buildSettins.devServer = {
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
  };
}

module.exports = buildSettins;