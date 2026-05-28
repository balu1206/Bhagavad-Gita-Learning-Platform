// ISSUE-014: Centralized logging utility for production error visibility.
// Replace console.error usage in API routes and server components with this
// so we can later route to Sentry / Datadog without code changes.

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function format(level: LogLevel, scope: string, msg: string, context?: LogContext): string {
  const ts = new Date().toISOString();
  const ctx = context ? ` ${JSON.stringify(context)}` : '';
  return `[${ts}] [${level.toUpperCase()}] [${scope}] ${msg}${ctx}`;
}

function emit(level: LogLevel, scope: string, msg: string, error?: unknown, context?: LogContext) {
  const line = format(level, scope, msg, context);

  switch (level) {
    case 'error':
      // eslint-disable-next-line no-console
      console.error(line, error ?? '');
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(line);
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(line);
      break;
    case 'debug':
    default:
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug(line);
      }
  }
}

export const logger = {
  debug: (scope: string, msg: string, context?: LogContext) =>
    emit('debug', scope, msg, undefined, context),
  info: (scope: string, msg: string, context?: LogContext) =>
    emit('info', scope, msg, undefined, context),
  warn: (scope: string, msg: string, context?: LogContext) =>
    emit('warn', scope, msg, undefined, context),
  error: (scope: string, msg: string, error?: unknown, context?: LogContext) =>
    emit('error', scope, msg, error, context),
};
