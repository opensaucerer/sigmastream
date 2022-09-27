import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import logger from './logger';
const env = process.env;

// server setup
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url as string, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path?.replace(/^\/+|\/+$/g, '');

  if (trimmedPath === 'stream') {
    switch (req.method) {
      case 'PUT':
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'GET Endpoint' }));
        res.end();
        break;
      case 'DELETE':
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: 'POST Endpoint' }));
        res.end();
        break;
      default:
        res.writeHead(405);
        res.end();
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'Not Found' }));
    res.end();
  }
});

server.listen(Number(env.port) || 3000, () => {
  console.log(
    `The server is listening on http://localhost:${env.port || 3000}`
  );
});

// listen on request to server
server.on('request', (req, res) => {
  // intercept the request and log it
  logger.requestLogger(req, res, () => {});
});

// listen on error to server
server.on('error', (err) => {
  // intercept the error and log it
  logger.errorLogger(err, () => {});
});

// setup graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});

// run the server using the command
// tsc server.ts && node server.js
