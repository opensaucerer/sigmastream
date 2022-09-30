import * as streamLogic from '../logic/stream';
import * as http from 'http';

export function home(req: http.IncomingMessage, res: http.ServerResponse) {
  res.status(200).json({
    status: true,
    message: 'Welcome to Sigma streaming server',
    version: '1.0.0',
  });
}

export async function registerStream(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let data = await streamLogic.registerStream({
    streamId: req.params.streamId,
    userId: req.params.userId,
  });
  if (!data.status) {
    return res.status(403).json({
      status: false,
      message: data.message,
      error: data.error,
    });
  }
  return res.status(200).json({
    status: true,
    message: data.message,
    data: data.data,
  });
}

export async function unregisterStream(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let data = await streamLogic.unregisterStream({
    streamId: req.params.streamId,
    userId: req.params.userId,
  });
  if (!data.status) {
    return res.status(403).json({
      status: false,
      message: data.message,
      error: data.error,
    });
  }
  return res.status(200).json({
    status: true,
    message: data.message,
    data: data.data,
  });
}
