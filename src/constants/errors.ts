/**
 * 服务错误码定义
 */
export enum ErrorCode {
  // 服务内部错误
  TEST = 0,
  SERVER = 100,

  // 通用请求错误码
  FETCH_ERROR = 1000,
  FETCH_BUSINESS_ERROR = 1001,

  // 抖音处理错误
  DOUYIN = 1100,
  DOUYIN_GET_LIVE_INFO = 1101,
}

export const ErrorCodeMsg: Record<ErrorCode, string> = {
  [ErrorCode.TEST]: '测试错误文案',
  [ErrorCode.SERVER]: 'Server Error',

  // 通用请求错误码
  [ErrorCode.FETCH_ERROR]: '请求出错',
  [ErrorCode.FETCH_BUSINESS_ERROR]: '请求正常，但是后台接口报错',

  // 抖音处理错误
  [ErrorCode.DOUYIN]: '抖音直播链接获取出错',
  [ErrorCode.DOUYIN_GET_LIVE_INFO]: 'getLiveInfo 方法处理出错',
}
