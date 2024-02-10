import { Middleware } from 'koa'
import { Logger } from '@/core/logger'

const logger = new Logger('LoggerMiddleware', {
  devLog: true,
})

export function loggerMiddleware(): Middleware {
  return async (ctx, next) => {
    const startTime = Date.now()
    const { method, originalUrl } = ctx
    logger.log(`[START] ${method} ${originalUrl}`)
    await next()
    const { message, status } = ctx
    const endTime = Date.now()
    const costTime = endTime - startTime
    logger.log(`[END] ${method} ${originalUrl} ${status} ${message} ${costTime}ms`)
  }
}
