import log4js from 'log4js'

/**
 * 封装 Logger 日志组件，收归 log 方法。
 */
export default class Logger {
  static getLogger(name: string) {
    return new Logger(name)
  }

  /** 将跨行的字符串转成一行 */
  static formatString = (msg: string) => msg.replace(/\n/g, ' ').replace(/\s+/g, ' ')
  /** 将 Error 转成日志能打印的字符串 */
  static formatError = (error: any) => {
    if (error instanceof Error) {
      return `{ name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`
    }

    if (typeof error === 'object') return JSON.stringify(error)
    return String(error)
  }

  private logger: log4js.Logger

  /** 将跨行的字符串转成一行 */
  formatString = (msg: string) => Logger.formatString(msg)
  /** 将 Error 转成日志能打印的字符串 */
  formatError = (error: any) => Logger.formatError(error)

  constructor(name: string) {
    log4js.configure({
      appenders: {
        prod: {
          // 按天分隔日志
          type: 'dateFile',
          // 配置文件名
          filename: 'run.log',
          // 指定编码格式为 utf-8
          encoding: 'utf-8',
          // 日志文件按日期（天）切割
          pattern: '-yyyy-MM-dd',
          // 回滚旧的日志文件时，保证以 .log 结尾
          keepFileExt: true,
          // 输出的日志文件名是都始终包含 pattern 日期结尾
          alwaysIncludePattern: true
        },
        dev: {
          type: 'stdout'
        }
      },
      categories: {
        default: {
          appenders: ['prod'],
          level: 'info'
        },
        dev: {
          appenders: ['dev'],
          level: 'debug'
        }
      }
    })

    this.logger = log4js.getLogger(name)
  }

  /**
   * 普通日志上报，仅存在本地磁盘，用于追溯链路日志，方便查询链路信息，尽管报。
   */
  public log = (msg: string, ...args: any[]) => {
    this.logger.info(msg, ...args)
  }

  /**
   * 不重要的错误日志上报，仅存在本地磁盘，用于追溯链路日志。
   */
  public warn = (msg: string, ...args: any[]) => {
    this.logger.warn(msg, ...args)
  }

  /**
   * 错误日志上报，现网下会上报到日志服务平台，方便及时发现异常。
   */
  public error = (msg: string, ...args: any[]) => {
    this.logger.error(msg, ...args)
  }
}

export const logger = new Logger('')
