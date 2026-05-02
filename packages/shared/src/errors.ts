export class RadarError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly meta: Record<string, unknown> | undefined;

  constructor(code: string, message: string, statusCode = 500, meta?: Record<string, unknown>) {
    super(message);
    this.name = 'RadarError';
    this.code = code;
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

export class ValidationError extends RadarError {
  constructor(message: string, meta?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, meta);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends RadarError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', `${resource}${id ? ` ${id}` : ''} introuvable`, 404, { resource, id });
    this.name = 'NotFoundError';
  }
}

export class AgentError extends RadarError {
  constructor(message: string, meta?: Record<string, unknown>) {
    super('AGENT_ERROR', message, 502, meta);
    this.name = 'AgentError';
  }
}

export const isRadarError = (e: unknown): e is RadarError =>
  e instanceof RadarError;
