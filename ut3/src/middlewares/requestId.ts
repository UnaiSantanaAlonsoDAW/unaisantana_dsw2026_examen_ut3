import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestId(req: Request, _res: Response, next: NextFunction): void {

  const isDEPURACION = env.DEPURACION == '1';

  req.requestId = randomUUID();
  if(isDEPURACION){
    console.log('[1] requestId', req.requestId);
  }
  next();
}
