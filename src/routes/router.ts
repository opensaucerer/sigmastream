import * as http from 'http';

let methods = ['get', 'post', 'put', 'delete', 'patch'];

let routesTable: Record<
  string,
  Record<string, (req: http.IncomingMessage, res: http.ServerResponse) => void>
> = {};

function getRouteFunction(
  path: string,
  method: string
): (req: http.IncomingMessage, res: http.ServerResponse) => void {
  return (
    routesTable[path.toLowerCase()] &&
    routesTable[path.toLowerCase()][method.toLowerCase()]
  );
}

export function handleRouting(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  let routeFunction = getRouteFunction(req.path, req.method as string);
  if (routeFunction) {
    routeFunction(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: 'Not Found' }));
    res.end();
  }
}

function registerRoute(
  path: string,
  method: string,
  routeFunction: (req: http.IncomingMessage, res: http.ServerResponse) => void
): void {
  if (!routesTable[path.toLowerCase()]) {
    routesTable[path.toLowerCase()] = {};
  }
  routesTable[path.toLowerCase()][method.toLowerCase()] = routeFunction;
}

export default {
  get: (
    path: string,
    callback: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ): void => {
    registerRoute(path, methods[0], callback);
  },
  post: (
    path: string,
    callback: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ): void => {
    registerRoute(path, methods[1], callback);
  },
  put: (
    path: string,
    callback: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ): void => {
    registerRoute(path, methods[2], callback);
  },
  delete: (
    path: string,
    callback: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ): void => {
    registerRoute(path, methods[3], callback);
  },
};
