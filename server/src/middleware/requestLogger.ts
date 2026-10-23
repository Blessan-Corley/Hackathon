import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.method !== 'GET' || req.originalUrl.includes('/replay') || req.originalUrl.includes('/route')) {
      console.log(`[Audit] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
}
