const settings = require('./project-settings');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./project-paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.',
  );
}

// Get props from node
const argv = require('minimist')(process.argv.slice(2));

// Define Theme for project
process.env.THEME = settings.multiTheme.enabled ? argv.theme || settings.multiTheme.defaultTheme : '';

// All project themes
process.env.THEMES = settings.multiTheme.enabled ? settings.multiTheme.themes : [];

// Grab NODE_ENV & APP_YOUR_NAME environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const APP_ENV = /^APP_/i;

const getClientEnvironment = (publicUrl = '') => {
  const raw = Object.keys(process.env)
    .filter(key => APP_ENV.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        THEME: process.env.THEME,
        PROD: process.env.NODE_ENV === 'production',
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches APP into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
      },
    );

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
