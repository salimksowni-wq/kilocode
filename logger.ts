/**
 * Logger Utility - Async, Non-blocking Logging
 * Status: Production-ready
 * 
 * Features:
 * - Non-blocking async logging
 * - Three levels: INFO, WARN, ERROR
 * - Console output for development
 * - Error persistence in sessionStorage
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = !import.meta.env.PROD;
  private errorBuffer: LogEntry[] = [];
  private maxErrorBuffer = 50;

  /**
   * Log info level message
   */
  public info(message: string, data?: unknown): void {
    this.log('INFO', message, data);
  }

  /**
   * Log warning level message
   */
  public warn(message: string, data?: unknown): void {
    this.log('WARN', message, data);
  }

  /**
   * Log error level message
   */
  public error(message: string, error?: unknown): void {
    this.log('ERROR', message, error);
    this.persistError(message, error);
  }

  /**
   * Internal log method (async non-blocking)
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    // Async execution to avoid blocking
    queueMicrotask(() => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
      };

      // Development console output
      if (this.isDevelopment) {
        this.logToConsole(entry);
      }
    });
  }

  /**
   * Format and send to browser console
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level}]`;

    switch (entry.level) {
      case 'INFO':
        console.log(`%c${prefix}%c ${entry.message}`, 'color: #0ea5e9', 'color: inherit', entry.data);
        break;
      case 'WARN':
        console.warn(`%c${prefix}%c ${entry.message}`, 'color: #f59e0b', 'color: inherit', entry.data);
        break;
      case 'ERROR':
        console.error(`%c${prefix}%c ${entry.message}`, 'color: #ef4444', 'color: inherit', entry.data);
        break;
    }
  }

  /**
   * Persist errors to sessionStorage for debugging
   */
  private persistError(message: string, error: unknown): void {
    try {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message,
        data: error instanceof Error ? error.message : String(error),
      };

      this.errorBuffer.push(entry);

      // Keep buffer size manageable
      if (this.errorBuffer.length > this.maxErrorBuffer) {
        this.errorBuffer.shift();
      }

      // Persist to sessionStorage (non-blocking)
      setTimeout(() => {
        try {
          sessionStorage.setItem(
            'weather_dashboard_errors',
            JSON.stringify(this.errorBuffer)
          );
        } catch {
          // Storage quota exceeded - ignore
        }
      }, 0);
    } catch {
      // Fail silently
    }
  }

  /**
   * Get persisted errors (for debugging)
   */
  public getErrorLog(): LogEntry[] {
    try {
      const stored = sessionStorage.getItem('weather_dashboard_errors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    try {
      sessionStorage.removeItem('weather_dashboard_errors');
      this.errorBuffer = [];
    } catch {
      // Ignore
    }
  }
}

// Export singleton instance
export const logger = new Logger();
