import type { Request, Response } from 'express';
import { env } from '../config/env.js';

export function notFound(req: Request, res: Response): void {

  const isDEPURACION = env.DEPURACION == '1';

  if (isDEPURACION){
      console.log('[notFound]', req.requestId, req.method, req.path);
  }

  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`,
  });
}
