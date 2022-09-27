import * as http from 'http';
import { ParsedUrlQuery } from 'querystring';
import logger from './logger';
import { parseURL } from './utils';
global.env = process.env; // load env once and make it global

// server setup
const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    // parse url
    req.path = parseURL(req.url as string).path;
    req.query = parseURL(req.url as string).query;
    if (req.path === 'stream') {
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
  }
);

server.listen(Number(env.PORT) || 3000, () => {
  console.log(
    `The server is listening on http://localhost:${env.port || 3000}`
  );
});

// listen on request to server
server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
  // intercept the request and log it
  logger.requestLogger(req, res, () => {});
});

// listen on error to server
server.on('error', (err: Error) => {
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
