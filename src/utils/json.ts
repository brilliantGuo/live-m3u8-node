import { logger } from '@/core/logger'

export function parseJSONString<T>(str: string): T | undefined;
export function parseJSONString<T>(str: string, defaultValue: T): T;

/**
 * 安全解析 JSON 字符串的方法
 *
 * @param moduleName 代码调用所属的模块，报错时记录到日志用
 * @param str 要解析的 JSON 字符串
 * @param defaultValue 解析失败时，默认返回的值
 */
export function parseJSONString<T>(str: string, defaultValue?: T): T | undefined {
  if (!str) return defaultValue;
  try {
    const val = JSON.parse(str) as T;
    return val;
  } catch (error) {
    const errMsg = logger.formatError(error);
    logger.error(`parseJSONString error: { rawString: "${str}", error: ${errMsg} }`);
    return defaultValue;
  }
}
