// Component JS
import $ from 'jquery';
import './my-first-component';
import SETTINGS from './settings';

// Component styles
import './my-first-component.scss';

// Handler
$('document').ready(() => {
  const $core = $(`.${SETTINGS.JS_HOOKS.CORE}`);
  // Init Component
  $core.myFirstComponent();
});
