import * as http from 'http';
import router from './router';

router.put(
  '/stream/:streamId',
  function registerStream(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'PUT NO Endpoint' }));
    res.end();
  }
);

router.delete(
  '/stream/:streamId',
  function unregisterStream(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'DELETE Endpoint' }));
    res.end();
  }
);

router.get('', (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(
    JSON.stringify({
      status: true,
      message: 'Welcome to Sigma streaming server',
      version: '1.0.0',
    })
  );
  res.end();
});
