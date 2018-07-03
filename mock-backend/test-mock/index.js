import successData from './success-data.mock';

/**
 * @param {MockAdapter} mock
 */
export default function (mock) {
  mock.onPost('https://mock.loc/test-mock').reply(200, successData);
}