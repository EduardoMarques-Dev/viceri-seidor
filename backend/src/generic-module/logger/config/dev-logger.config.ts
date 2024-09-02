import { createLogger, format, transports } from 'winston';

// Cores ANSI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

function setColor(text: string, color: string) {
  const chosenColor = colors[color];
  if (!chosenColor) {
    throw new Error(`Cor '${color}' não é suportada.`);
  }
  return `${chosenColor}${text}${colors.reset}`;
}

export function buildDevLogger() {
  const logFormat = format.printf(
    ({ timestamp, level, message, stack, context = '' }) => {
      const coloredContext = setColor(context, 'yellow');
      return `${coloredContext} | ${timestamp} | ${level}: ${
        stack || message
      } `;
    },
  );
  return createLogger({
    level: 'debug',
    format: format.combine(
      format.colorize(),
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
