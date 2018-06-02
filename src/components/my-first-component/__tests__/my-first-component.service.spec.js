import MyFirstComponentService from '../my-first-component.service';
import SETTINGS from '../settings';

describe('MyFirstComponentService', () => {
  let service;
  beforeEach(() => {
    // set body html
    document.documentElement.innerHTML = getMockHtml('/mockHtml/my-first-component.html');
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
