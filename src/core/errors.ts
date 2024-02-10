/**
 * 服务错误码定义
 */
export enum ErrorCode {
  TEST = 101,
  PIPELINE = 1000,
  SERVER = 9999,
}

export const ErrorCodeMsg: Record<ErrorCode, string> = {
  [ErrorCode.TEST]: '测试错误文案',
  [ErrorCode.PIPELINE]: 'PIPELINE Error',
  [ErrorCode.SERVER]: 'Server Error',
}

export class CustomError extends Error {
  name = 'CustomError'
  errorCode: ErrorCode
  errorMsg: string

  constructor(errorCode: ErrorCode, rawError?: Error) {
    super(rawError?.message)
    this.errorCode = errorCode
    this.errorMsg = ErrorCodeMsg[errorCode]
  }
}

type GetFirstElement<T extends any[]> = T extends [infer F, ...any[]] ? F : never
type CheckFunction<T extends any> = T extends (...args: any[]) => any ? T : never


// type B = Parameters<number>

// export function pipeline<T extends [(...args: any) => any, ErrorCode][]>(arrs: T) {
//   type FirstFunc = CheckFunction<GetFirstElement<GetFirstElement<T>>>;
//   return (...args: ) => arrs.reduce((res: any[] | CustomError, curr) => {
//     if (res instanceof CustomError) return res
//     try {
//       const funcRes = curr[0](...res)
//       return [funcRes]
//     } catch (error) {
//       const customError = error instanceof Error
//         ? new CustomError(ErrorCode.PIPELINE, error)
//         : new CustomError(ErrorCode.PIPELINE)
//       return customError
//     }
//   }, args)
// }
