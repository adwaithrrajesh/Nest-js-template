import rateLimit from 'express-rate-limit';
import { INestApplication } from '@nestjs/common';

export const setupRateLimiter = (app: INestApplication) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per window
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Too many requests from this IP, please try again later.',
    },
  });

  // Register with NestJS application
  app.use(limiter);
};
