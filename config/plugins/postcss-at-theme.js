const postcss = require('postcss');
const { root } = require('postcss');

module.exports = postcss.plugin('postcss-at-theme', function (opts) {
  opts = opts || {};
  opts.themes = opts.themes || [];

  function isCommonRule(rule) {
    return ~opts.themes.indexOf(rule) >= 0;
  }

  function recursiveWalker(container, parent) {
    return function (node) {
      if (node.parent !== parent) return;

      if (!isCommonRule(node.name) && node.name !== opts.current) {
        node.remove();
        return;
      }

      container.append(node.nodes);

      if (node.nodes.length) {
        node.walkAtRules(recursiveWalker(container, node))
      }
    }
  }

  function themesHandler(css, themeRule) {
    if (themeRule.name !== opts.current) {
      themeRule.remove();
      return;
    }

    themeRule.walkRules(function (rule) {
      css.append(rule);
    });

    themeRule.remove();
  }

  return function (css) {
    // filter @{rule}
    css.walkAtRules(function (atRule) {
      const CONTAINER = new root();

      if (!isCommonRule(atRule.name)) {
        themesHandler(css, atRule);
        return;
      }

      atRule.walkAtRules(recursiveWalker(CONTAINER, atRule));

      atRule.append(CONTAINER);
    });
  };
});