import Modernizr from 'modernizr';
import 'matchmedia-polyfill';
import 'babel-polyfill';
import assign from 'object-assign';

window.Modernizr = Modernizr;
Object.assign = assign;

// Add Modernizr test
Modernizr.addTest('is-ios', function () {
  return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
});
