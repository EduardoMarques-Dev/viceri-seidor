import { createLogger, format, transports } from 'winston';

export function buildQaLogger() {
  const logFormat = format.printf(
    ({ timestamp, level, message, stack, context = '' }) => {
      return `${context} | ${timestamp} | ${level}: ${stack || message} `;
    },
  );
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      logFormat,
    ),
    defaultMeta: { service: 'integr8' },
    transports: [new transports.Console()],
  });
}
