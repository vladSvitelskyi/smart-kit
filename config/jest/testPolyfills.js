import $ from 'jquery';
import njk from 'nunjucks';

global.$ = $;

/**
 * Render njk template with data
 * @param htmlPath
 */
global.templateRender = function (htmlPath) {
  return function (data = {}) {
    return njk.compile(htmlPath).render(data);
  }
};
