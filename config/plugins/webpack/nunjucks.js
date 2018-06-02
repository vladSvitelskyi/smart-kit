const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');
const entry = require('webpack-glob-entry');
const projectPaths = require('../../project-paths');

module.exports = function nunjucksWebpackPlugin(templateContext = {}) {
  // To build njk files
  const templateFiles = entry(projectPaths.appSrc + '/pages/**/[^_]*.njk') || {};
  const templates = Object.keys(templateFiles)
    .map(name => ({ from: templateFiles[name], to: `${name}.html`, context: templateContext }));

  // Create new HtmlWebpackPlugin with options
  return new NunjucksWebpackPlugin({ templates });
};