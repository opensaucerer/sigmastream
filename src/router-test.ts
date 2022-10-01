import './mock';
import * as http from 'http';
import router, { getRoute, getRouteFunction } from './router';

jest('Shoud register a new route', () => {
  router.get('/test', (req, res) => {});

  const data = getRoute('/test');
  expect(data.get).toBeOfType('function');
});

jest('Shoud register a new route with path variables', () => {
  router.get('/test/:id', (req, res) => {});

  const data = getRoute('/test/1234567890');
  expect(data.get).toBeOfType('function');
});

jest('Shoud register a new route with multiple path variables', () => {
  router.get('/test/:id/:name', (req, res) => {});

  const data = getRoute('/test/1234567890/abc');
  expect(data.get).toBeOfType('function');
});

jest('Should register a new route with multiple methods', () => {
  router.get('/test', (req, res) => {});
  router.post('/test', (req, res) => {});
  router.put('/test', (req, res) => {});
  router.delete('/test', (req, res) => {});

  const data = getRoute('/test');
  expect(data.get).toBeOfType('function');
  expect(data.post).toBeOfType('function');
  expect(data.put).toBeOfType('function');
  expect(data.delete).toBeOfType('function');
});

jest('Should get route function', () => {
  router.get('/test', (req, res) => {});

  const data = getRouteFunction('/test', 'get');
  expect(data?.fn).toBeOfType('function');
});
