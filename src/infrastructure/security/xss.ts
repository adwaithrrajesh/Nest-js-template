import { INestApplication, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import { logDebug } from '../logger/logger';

@Injectable()
export class XssSanitization implements NestMiddleware {
  private sanitizeObject(obj: any) {
    if (!obj || typeof obj !== 'object') return obj;

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key]);
      }
    }

    return obj;
  }

  public use = (req: Request, res: Response, next: NextFunction) => {
    this.sanitizeObject(req.body);
    this.sanitizeObject(req.params);
    this.sanitizeObject(req.query);
    next();
  };
}

// ✅ Wrapper to integrate with app
export const setupXSS = (app: INestApplication) => {
  const middleware = new XssSanitization();
  app.use(middleware.use);
  logDebug('XSS sanitization configured', 'ServerInfrastructure');
};
