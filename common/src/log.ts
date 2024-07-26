import chalk from 'chalk'

export interface LoggerTransport {
  log: (level: string, message: string) => void
}

const levelColors: { [key in LogLevel]: (msg: string) => string } = {
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
}

export class ConsoleTransport implements LoggerTransport {
  log(level: string, message: string): void {
    const colorFn = levelColors[level as LogLevel] || chalk.white
    console.log(colorFn(`[${level.toUpperCase()}]: ${message}`))
  }
}

type LogLevel = 'info' | 'warn' | 'error'

interface LoggerConfig {
  level: LogLevel
}

export class Log {
  private transports: LoggerTransport[] = []
  private logLevel: LogLevel = 'info'

  private levelOrder: { [key in LogLevel]: number } = {
    info: 0,
    warn: 1,
    error: 2,
  }

  constructor(transports: LoggerTransport[] = []) {
    this.transports = transports
  }

  public configure(config: LoggerConfig) {
    this.logLevel = config.level
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelOrder[level] >= this.levelOrder[this.logLevel]
  }

  private log(level: LogLevel, message: string) {
    if (this.shouldLog(level)) {
      this.transports.forEach(transport => transport.log(level, message))
    }
  }

  public info(message: string) {
    this.log('info', message)
  }

  public warn(message: string) {
    this.log('warn', message)
  }

  public error(message: string) {
    this.log('error', message)
  }
}

export const log = new Log()
