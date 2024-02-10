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
