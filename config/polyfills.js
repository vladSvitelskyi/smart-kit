import Modernizr from 'modernizr';
import 'airbnb-browser-shims';

// Add Modernizr test
Modernizr.addTest('is-ios', function () {
  return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
});
