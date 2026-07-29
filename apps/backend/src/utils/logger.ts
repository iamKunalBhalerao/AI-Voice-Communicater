type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const COLORS = {
  reset: "\x1b[0m",
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

class Logger {
  private level: LogLevel = "info";
  private isProduction = process.env.NODE_ENV === "production";

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLevel && envLevel in LEVEL_SEVERITY) {
      this.level = envLevel;
    } else if (!this.isProduction) {
      this.level = "debug";
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_SEVERITY[level] >= LEVEL_SEVERITY[this.level];
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();

    if (this.isProduction) {
      // In production, we log structured JSON
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...(meta !== undefined ? { meta } : {}),
      });
    }

    // In development, we use colorized pretty-printing
    const color = COLORS[level] || COLORS.reset;
    const formattedMeta =
      meta !== undefined ? `\n${JSON.stringify(meta, null, 2)}` : "";
    return `${color}[${timestamp}] [${level.toUpperCase()}]: ${message}${COLORS.reset}${formattedMeta}`;
  }

  debug(message: string, meta?: any) {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }

  info(message: string, meta?: any) {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, meta));
    }
  }

  warn(message: string, meta?: any) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, meta));
    }
  }

  error(message: string, meta?: any) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, meta));
    }
  }
}

export const logger = new Logger();
export type { LogLevel };
