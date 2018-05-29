const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
const getAppDirectory = () => {
  return fs.realpathSync(process.cwd());
};

const resolveApp = (relativePath) => {
  return path.resolve(getAppDirectory(), relativePath)
};

// Project paths
module.exports = {
  appRoot: getAppDirectory(),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  servedPath: '/', // Should be changed to NODE_ENV in future
  appNodeModules: resolveApp('node_modules'),
};
