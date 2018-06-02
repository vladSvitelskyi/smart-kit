import $ from 'jquery';
import path from 'path';
import fs from 'fs';
import callsite from 'callsite';

global.$ = $;
global.getMockHtml = function (htmlPath) {
  const stack = callsite();
  const requester = stack[1].getFileName();
  const calledDir = path.dirname(requester);
  const formatedPath = path.normalize(calledDir + htmlPath);

  return fs.readFileSync(formatedPath).toString();
};
