const CleanWebpackPlugin = require('clean-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const autoprefixer = require('autoprefixer');
const projectPaths = require('./project-paths');

// Common Css loaders
const commonCssLoaders = [
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-combine-duplicated-selectors')({
          removeDuplicatedProperties: true,
        }),
        require('postcss-flexbugs-fixes'),
        require('postcss-pseudoelements'),
        autoprefixer({
          remove: false,
          browsers: [
            '>1%',
            'last 7 versions',
            'Firefox ESR',
            'not ie < 11',
          ],
          flexbox: 'no-2009',
        }),
      ],
    },
  },
  'sass-loader',
];

// Common settings
const commonSettings = {
  entry: {
    polyfills: [
      require.resolve('./polyfills'),
    ],
    main: projectPaths.appIndexJs,
  },
  output: {
    path: projectPaths.appBuild,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.njk'],
  },
  stats: 'minimal',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-pretty'),
          emitWarning: true,
        },
      },
      {
        oneOf: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
          },
          {
            test: /.(ttf|otf|eot|webfont.svg|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [{
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]',
              },
            }],
          },
          {
            loader: 'file-loader',
            exclude: [/\.js$/, /\.html$/, /\.scss/, /\.json$/, /\.njk$/],
            options: {
              name: 'media/[name].[hash:8].[ext]',
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
    new CleanWebpackPlugin(projectPaths.appBuild, {
      verbose: true,
      root: projectPaths.appRoot,
    }),
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: ['**/*.scss'],
      formatter: require('stylelint-formatter-pretty'),
    }),
  ],
};

module.exports = {
  commonSettings,
  commonCssLoaders,
}