import * as http from 'http';
import router from './router';

router.put(
  'stream',
  function registerStream(req: http.IncomingMessage, res: http.ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'GET Endpoint' }));
    res.end();
  }
);

router.delete(
  'stream',
  function unregisterStream(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'GET Endpoint' }));
    res.end();
  }
);
