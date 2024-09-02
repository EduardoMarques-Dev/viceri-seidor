import { transports, format, createLogger } from 'winston';

export function buildProdLogger() {
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.label({ label: 'integr8' }),
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
    ),
    transports: [new transports.Console()],
  });
}
