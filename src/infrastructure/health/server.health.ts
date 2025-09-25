import { INestApplication } from '@nestjs/common';

export const setupServerHealthCheck = (app: INestApplication) => {
  app.getHttpAdapter().get('/health/server', async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: { uptime: process.uptime() },
    });
  });
};
