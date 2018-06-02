// Component JS
import $ from 'jquery';
import SETTINGS from './settings';

// Service Adapter
class MyFirstComponentService {
  constructor() {
    this.componentName = 'MyFirstComponent';
  }

  getItem(target) {
    return $(target).closest(`.${SETTINGS.CLASSES.ITEM}`);
  }

  logComponentName() {
    console.log(this.componentName);
  }
}

export default MyFirstComponentService;
