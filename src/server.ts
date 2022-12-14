import * as http from 'http';
import logger from './logger';
import { parseURL, readBody } from './utils';
import * as rest from './rest';
import * as dotenv from './dotenv';
dotenv.loadEnv();
import * as router from './router';
import './route';
import './config/env';
import * as dynamo from './database/dynamo';
dynamo.createStreamTable();

// server setup
const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    // parse url
    req.path = parseURL(req.url as string).path;
    req.query = parseURL(req.url as string).query;

    // parse req body
    let data = await readBody(req);
    req.body = data.body;
    req.raw = data.raw;

    // overload res object
    res = rest.overloadResponse(res);

    // handle routing
    router.handleRouting(req, res);
  }
);

server.listen(Number(env.PORT) || 3000, () => {
  console.log(
    `The server is listening on http://localhost:${env.PORT || 3000}`
  );
});

// intercept the request and log it
server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
  // listen for response to be finished
  res.on('finish', () => {
    logger.requestLogger(req, res, () => {});
  });
});

// listen on error to server
server.on(
  'error',
  (err: Error, req: http.IncomingMessage, res: http.ServerResponse) => {
    // intercept the error and log it
    logger.errorLogger(err, () => {});
  }
);

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
