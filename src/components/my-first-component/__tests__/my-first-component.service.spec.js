import MyFirstComponentService from '../my-first-component.service';
import template from './mockHtml/my-first-component.njk';
import SETTINGS from '../settings';

describe('MyFirstComponentService', () => {
  let service;
  beforeEach(() => {
    // set body html
    document.documentElement.innerHTML = templateRender(template)();
    service = new MyFirstComponentService();
  });

  describe('Verify component item', () => {
    test('GetItem method should find component item', () => {
      const target = $(`.${SETTINGS.CLASSES.ITEM}`)[0];
      const $resultItem = service.getItem(target);

      expect($resultItem.length).toBe(1);
    });
  });
});
