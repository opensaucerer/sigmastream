import * as streamLogic from '../logic/stream';
import * as http from 'http';

export function home(req: http.IncomingMessage, res: http.ServerResponse) {
  res.status(200).json({
    status: true,
    message: 'Welcome to Sigma streaming server',
    version: '1.0.0',
  });
}

export function registerStream(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  res.status(200).json({ message: 'PUT NO Endpoint' });
}

export function unregisterStream(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  res.status(200).json({ message: 'DELETE Endpoint' });
}
