import { ErrorCode, ErrorCodeMsg } from '@/constants/errors'

export interface ServerErrorOptions {
  rawError?: any
  data?: any
}

export class ServerError extends Error {
  name = 'ServerError'
  errorCode: ErrorCode
  errorMsg: string
  data?: any

  constructor(errorCode: ErrorCode, opts?: ServerErrorOptions) {
    const rawError = opts?.rawError
    super(rawError?.message)
    this.errorCode = errorCode
    this.errorMsg = ErrorCodeMsg[errorCode]
    this.data = opts?.data
    // 如果传入了原始 Error，那么堆栈信息用报错的 Error 的信息
    if (rawError?.stack) {
      this.stack = rawError.stack
    }
  }
}

export interface CatchErrorOptions {
  errorCode: ErrorCode
}

/**
 * 高阶函数，对传入的方法做 try catch 处理，出错则抛出 ServerError
 * @param func
 * @param opts
 * @returns
 */
export function catchError<T extends (...args: any[]) => any>(errorCode: ErrorCode, func: T) {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return func(...args)
    } catch (error) {
      if (error instanceof ServerError) {
        throw error
      }

      throw new ServerError(errorCode, {
        rawError: error,
        data: args
      })
    }
  }
}
