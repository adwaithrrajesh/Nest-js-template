// src/common/health/database.health.ts
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@infrastructure/prisma/prisma.service';

export const setupDatabaseHealthCheck = (app: INestApplication) => {
  app.getHttpAdapter().get('/health/db', async (req, res) => {
    try {
      const prisma = app.get(PrismaService);

      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        success: true,
        message: 'Database is healthy',
        data: { uptime: process.uptime() },
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        message: 'Database is unhealthy',
        data: { error: error.message },
      });
    }
  });
};
