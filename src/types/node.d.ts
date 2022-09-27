import { ParsedUrlQuery } from 'querystring';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
    }
  }
  var env: NodeJS.ProcessEnv;
}

declare module 'http' {
  interface IncomingMessage {
    query: Record<string, string> | ParsedUrlQuery;
    path: string;
    body: Record<string, any>;
  }
}

export {};
