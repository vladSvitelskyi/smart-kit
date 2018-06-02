// Component JS
import $ from 'jquery';
import MyFirstComponentService from './my-first-component.service';

/**
 * myFirstComponent - a custom jQuery plugin.
 *
 * @method myFirstComponent
 * @memberOf jQuery
 */
$.fn.myFirstComponent = function () {
  const Service = new MyFirstComponentService();

  Service.logComponentName();
};
