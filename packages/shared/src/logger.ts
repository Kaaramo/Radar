type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const currentLevel = (): number => {
  const env = (process.env['LOG_LEVEL'] ?? 'info') as LogLevel;
  return LEVELS[env] ?? 20;
};

const log = (level: LogLevel, scope: string, msg: string, meta?: Record<string, unknown>): void => {
  if (LEVELS[level] < currentLevel()) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    scope,
    msg,
    ...(meta ?? {}),
  };
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  stream.write(JSON.stringify(entry) + '\n');
};

export const createLogger = (scope: string) => ({
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', scope, msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log('info', scope, msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', scope, msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', scope, msg, meta),
  child: (subScope: string) => createLogger(`${scope}:${subScope}`),
});

export type Logger = ReturnType<typeof createLogger>;
