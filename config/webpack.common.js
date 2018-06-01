const CleanWebpackPlugin = require('clean-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const projectPaths = require('./project-paths');

// Common settings
const commonSettings = {
  entry: {
    vendor: [
      projectPaths.appPolyfills,
    ],
    main: projectPaths.appIndexJs,
  },
  output: {
    path: projectPaths.appBuild,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.njk'],
    alias: {
      modernizr$: projectPaths.modernizrSettings,
    },
  },
  stats: 'minimal',
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
  plugins: [
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
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: ['**/*.scss'],
      formatter: require('stylelint-formatter-pretty'),
    }),
  ],
};

// Common Css loaders
const commonCssLoaders = (data) => {
  return [
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('./plugins/postcss-at-theme')({
            current: data.currentTheme,
            themes: data.themes,
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
  ];
};

module.exports = {
  commonSettings,
  commonCssLoaders,
}