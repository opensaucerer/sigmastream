import { ParsedUrlQuery } from 'querystring';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      ACCESS_KEY: string;
      SECRET_KEY: string;
    }
  }
  var env: NodeJS.ProcessEnv;
}

declare module 'http' {
  interface IncomingMessage {
    query: Record<string, string> | ParsedUrlQuery;
    path: string;
    body: Record<string, any>;
    raw: any;
    params: Record<string, string>;
    route: string;
  }

  interface ServerResponse {
    status: (statusCode: number) => {
      json: (data: any) => void;
    };
  }
}

export {};
