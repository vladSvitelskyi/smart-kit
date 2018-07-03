import MockAdapter from 'axios-mock-adapter';

// Rewritten on ES5 for IE issue

function MockLogAdapter(axios, options) {
  MockAdapter.call(this, axios, options);
}

MockLogAdapter.prototype = Object.create(MockAdapter.prototype);

/**
 *
 * @param {number} status
 * @param {any} data
 * @return {function(*): *[]}
 */
MockLogAdapter.prototype.logger = function (status, data) {
  return function (config) {
    console.group('Request to: ' + config.url);
    console.log('%cstatus: %c' + status, 'color:blue;', 'color: #DB3236');
    console.log('%cresponse: ', 'color:blue;', data);
    console.groupCollapsed('Params: ->');
    console.log(config.params);
    console.groupEnd();
    console.groupEnd();

    return [status, data];
  }
};

/**
 *
 * @param {Function} reply
 * @return {Function}
 */
MockLogAdapter.prototype.replyHandler = function (reply) {
  return (function (status, body) {
    if (typeof status === 'function') {
      return reply(status);
    } else {
      return reply(this.logger(status, body))
    }
  }).bind(this);
};

/**
 *
 * @param {string|RegExp} matcher
 * @param {RequestDataMatcher=} body
 * @return {RequestHandler}
 */
MockLogAdapter.prototype.onGet = function (matcher, body) {
  var box = MockAdapter.prototype.onGet.call(this, matcher, body);
  box.reply = this.replyHandler(box.reply);

  return box;
};

export default MockLogAdapter;