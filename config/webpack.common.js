const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const autoprefixer = require('autoprefixer');
const projectPaths = require('./project-paths');

const commonCssLoaders = [
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-combine-duplicated-selectors')({
          removeDuplicatedProperties: true
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
        })
      ],
    },
  },
  'sass-loader'
];

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
          formatter: require("eslint-formatter-pretty"),
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
              }
            }]
          },
          {
            loader: 'file-loader',
            exclude: [/\.js$/, /\.html$/, /\.scss/, /\.json$/, /\.njk$/],
            options: {
              name: 'media/[name].[hash:8].[ext]',
            },
          },
        ]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(projectPaths.appBuild, {
      verbose: false,
      root: projectPaths.appRoot,
    }),
    new SimpleProgressWebpackPlugin({
      format: 'expanded'
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: ['**/*.scss'],
      formatter: require("stylelint-formatter-pretty"),
    }),
    // todo: make it work with njk or jsx dynamically
    new HtmlWebpackPlugin({
      title: 'Smart Kit HTML',
      template: './src/pages/index.html',
    }),
  ],
};

module.exports = {
  commonSettings,
  commonCssLoaders
}