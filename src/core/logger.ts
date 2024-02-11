import log4js, { Configuration } from 'log4js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LOG_FILENAME } from '@/constants/path'
import { IS_PROD, IS_PM2, PM_ID } from '@/config'

dayjs.extend(utc)

const DEFAULT_CONFIGURATION: Configuration = {
  appenders: {
    file: {
      // 按天分隔日志
      type: 'dateFile',
      // 配置文件名
      filename: LOG_FILENAME,
      // 指定编码格式为 utf-8
      encoding: 'utf-8',
      // 日志文件按日期（天）切割
      pattern: 'yyyy-MM-dd',
      // 回滚旧的日志文件时，保证以 .log 结尾
      keepFileExt: true,
      // 输出的日志文件名是都始终包含 pattern 日期结尾
      alwaysIncludePattern: true
    },
    stdout: {
      type: 'stdout'
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'info'
    },
    dev: {
      appenders: ['stdout', 'file'],
      level: 'debug'
    }
  },
  pm2: IS_PM2,
  pm2InstanceVar: 'INSTANCE_ID'
}

export interface LoggerOptions {
  devLog?: boolean
}

/**
 * 封装 Logger 日志组件，收归 log 方法。
 */
export class Logger {
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

  private name: string
  private logger: log4js.Logger

  constructor(name: string, opts?: LoggerOptions) {
    const { default: defaultCates, dev: devCates } = DEFAULT_CONFIGURATION.categories
    log4js.configure({
      ...DEFAULT_CONFIGURATION,
      // 重写对应 name 的 categories 输出
      categories: {
        ...DEFAULT_CONFIGURATION.categories,
        [name]: opts?.devLog && !IS_PROD ? devCates : defaultCates
      }
    })
    this.name = name
    this.logger = log4js.getLogger(name)
  }

  /** 将跨行的字符串转成一行 */
  public formatString = (msg: string) => Logger.formatString(msg)
  /** 将 Error 转成日志能打印的字符串 */
  public formatError = (error: any) => Logger.formatError(error)

  /**
   * 普通日志上报，仅存在本地磁盘，用于追溯链路日志，方便查询链路信息，尽管报。
   */
  public log = (...args: any[]) => {
    if (IS_PM2) {
      console.log(this.getPM2LogPrefix('INFO'), ...args)
      return
    }
    const msg = this.formatNativeMsg(args)
    this.logger.info(msg)
  }

  /**
   * 不重要的错误日志上报，仅存在本地磁盘，用于追溯链路日志。
   */
  public warn = (...args: any[]) => {
    if (IS_PM2) {
      console.warn(this.getPM2LogPrefix('WARN'), ...args)
      return
    }
    const msg = this.formatNativeMsg(args)
    this.logger.warn(msg)
  }

  /**
   * 错误日志上报，现网下会上报到日志服务平台，方便及时发现异常。
   */
  public error = (...args: any[]) => {
    if (IS_PM2) {
      console.error(this.getPM2LogPrefix('ERROR'), ...args)
      return
    }
    const msg = this.formatNativeMsg(args)
    this.logger.error(msg)
  }

  private getPM2LogPrefix = (level: string) => {
    const date = dayjs().utcOffset(8).format('YYYY-MM-DDTHH:mm:ss.SSS');
    return `[${date}][${PM_ID}][${level}][${this.name}]`
  }

  private formatNativeMsg = (msgs: any[]) => {
    // 如无必要，尽量避免使用 JSON.stringify
    const formattedMsg = msgs.map((msg) => {
      if (typeof msg !== 'object') return msg
      if (Array.isArray(msg)) return String(msg)
      return JSON.stringify(msg)
    })
    const msg = String(formattedMsg).replace(',', ', ')
    return msg
  }
}

export const logger = new Logger('App')
export default Logger
