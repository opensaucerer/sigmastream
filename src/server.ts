import * as http from 'http';
import logger from './logger';
import { parseURL } from './helpers/utils';
global.env = process.env; // load env once and make it global
import * as router from './routes';

// server setup
const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    // parse url
    req.path = parseURL(req.url as string).path;
    req.query = parseURL(req.url as string).query;

    // parse req body
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
      } catch (error) {
        req.body = {};
      }
    });

    // handle routing
    router.handleRouting(req, res);
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
