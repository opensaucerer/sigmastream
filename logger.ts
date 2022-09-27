// create an http logger middleware

import * as http from 'http';

export default {
  requestLogger: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: () => void
  ) => {
    console.log(
      `${new Date().toISOString()}: ${req.headers['user-agent']} - HTTP/${
        req.httpVersion
      }: ${req.method} - ${req.url} - ${res.statusCode} - ${res.statusMessage}`
    );
    next();
  },

  errorLogger: (err: Error, next: () => void) => {
    console.error(
      `${new Date().toISOString()}: ERROR OCCURED WITH TRACE: ${err.stack}`
    );
  },
};
