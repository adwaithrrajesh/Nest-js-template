import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'debug', 
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, context }) => {
      return `[${timestamp}] [${level}] ${context ? `[${context}] ` : ''}${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Helper functions
export const logInfo = (message: string, context?: string) => logger.info(message, { context });
export const logDebug = (message: string, context?: string) => logger.debug(message, { context });
export const logWarn = (message: string, context?: string) => logger.warn(message, { context });
export const logError = (message: string, context?: string) => logger.error(message, { context });