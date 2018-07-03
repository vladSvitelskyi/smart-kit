import axios from 'axios';
import MockLogAdapter from './MockLogAdapter';
import testMock from './test-mock';

// mock urls
// see: https://github.com/ctimmerm/axios-mock-adapter
const mock = new MockLogAdapter(axios);

// This sets the mock adapter on the default instance
testMock(mock);

// mock url wouldn't replace after passThrough
mock.onAny().passThrough();