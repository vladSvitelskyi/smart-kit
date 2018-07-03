const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
const getAppDirectory = () => {
  return fs.realpathSync(process.cwd());
};

const resolveApp = (relativePath) => {
  return path.resolve(getAppDirectory(), relativePath)
};

const envPublicUrl = process.env.PUBLIC_URL;

const ensureSlash = (path, needsSlash) => {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const getServedPath = (appPackageJson) => {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// Project paths
module.exports = {
  appRoot: getAppDirectory(),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appMockBe: resolveApp('mock-backend'),
  appPolyfills: resolveApp('config/polyfills'),
  appIndexJs: resolveApp('src/app.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  servedPath: getServedPath(resolveApp('package.json')),
  appNodeModules: resolveApp('node_modules'),
  modernizrSettings: resolveApp('.modernizrrc'),
};
