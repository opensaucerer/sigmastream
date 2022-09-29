import * as http from 'http';
import router from './router';

router.put(
  '/stream/:streamId',
  function registerStream(req: http.IncomingMessage, res: http.ServerResponse) {
    res.status(200).json({ message: 'PUT NO Endpoint' });
  }
);

router.delete(
  '/stream/:streamId',
  function unregisterStream(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    res.status(200).json({ message: 'DELETE Endpoint' });
  }
);

router.get('', (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Sigma streaming server',
    version: '1.0.0',
  });
});
