import './mock';
import * as utils from './utils';

jest('Should pasre query parameters in path', async () => {
  const path = '/test?name=abc&age=20';
  const params = utils.parseURL(path);
  expect(params.query).toBeObject({
    name: 'abc',
    age: '20',
  });
});

jest('Should pasre query parameters in path with no query', async () => {
  const path = '/test';
  const params = utils.parseURL(path);
  expect(params.query).toBeObject({});
});

jest('Should parse path variables', async () => {
  const path = '/test/1234567890';
  const route = '/test/:id';
  const params = utils.parsePathVariables(path, route);
  expect(params).toBeObject({
    id: '1234567890',
  });
});
