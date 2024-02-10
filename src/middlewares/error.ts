import { Middleware } from 'koa'
import { ErrorCode, ErrorCodeMsg } from '@/constants/errors'
import { ServerError } from '@/core/errors'
import { Logger } from '@/core/logger'

const logger = new Logger('ErrorHandlerMiddleware')

export interface ErrorMiddlewareOptions {
  errorCode: ErrorCode
}

export function errorHandlerMiddleware(opts?: ErrorMiddlewareOptions): Middleware {
  const { errorCode = ErrorCode.SERVER } = opts || {}
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      logger.error('ErrorHandlerMiddleware.catchError', error)
      if (error instanceof ServerError) {
        ctx.body = {
          code: error.errorCode,
          data: error.errorMsg,
          message: error.message
        }
        return
      }

      if (error instanceof Error) {
        ctx.body = {
          code: ErrorCode.SERVER,
          data: {},
          message: error.message
        }
        return
      }

      ctx.body = {
        code: errorCode,
        data: error,
        message: ErrorCodeMsg[errorCode]
      }
    }
  }
}
