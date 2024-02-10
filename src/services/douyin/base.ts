import Axios from 'axios'
import { AXIOS_DEFAULT_CONFIG } from '@/core/request'
import { CustomError, ErrorCode } from '@/core/errors'
import { getQueryString, getStringQuery } from '@/utils/url'
import { getMsToken } from './sign'

/**
 * 抖音接口请求所需 base query
 */
const BASE_QUERY = {
  device_platform: 'webapp',
  aid: '6383',
  channel: 'channel_pc_web',
  pc_client_type: '1',
  version_code: '170400',
  version_name: '17.4.0',
  cookie_enabled: 'true',
  screen_width: '1728',
  screen_height: '1117',
  browser_language: 'zh-CN',
  browser_platform: 'MacIntel',
  browser_name: 'Chrome',
  browser_version: '120.0.0.0',
  browser_online: 'true',
  engine_name: 'Blink',
  engine_version: '120.0.0.0',
  os_name: 'Mac+OS',
  os_version: '10.15.7',
  cpu_core_num: '10',
  device_memory: '8',
  platform: 'PC',
  downlink: '10',
  effective_type: '4g',
  round_trip_time: '50',
  webid: '7242925743624455738'
  // msToken: 'xlNOXVx_KOXKM-hh4cSzo7uTHrmKm4XPmLx-wtyxtyJ44YLbGOeXrX_UKpZi3cAMoBbO_nWwNM11LDZvm9P0rFR4xis9rylGIOke1CGjnjRmtPVhVhdcIXqpcVe96WIH',
  // 'X-Bogus': 'DFSzswVYqp0ANVoktiinODLNKBYu'
}

function getXBogus(query: Record<string, any>) {
  return ''
  const queryStr = getQueryString(query)
  console.log('queryStr:', queryStr)
  // const xBogus = sign(queryStr, USER_AGENT)
  const xBogus = 'DFSzswSLW5kANcpTtiEAct9WcBn6'
  console.log('getXBogus.res', { queryStr, xBogus })
  return xBogus
}

function getMsTokenFromCookie(cookieStr?: string) {
  if (!cookieStr) return
  const query = getStringQuery(cookieStr, ';')
  return query.msToken
}

/**
 * 抖音请求接口通用处理
 */
export const axios = Axios.create(AXIOS_DEFAULT_CONFIG)
axios.interceptors.request.use((config) => {
  const baseQuery = { ...BASE_QUERY, ...config.params }
  const msToken = getMsTokenFromCookie(config.headers.cookie) || getMsToken(107)
  const xBogus = getXBogus(baseQuery)
  config.params = { ...baseQuery, msToken, xBogus }
  return config
})
axios.interceptors.response.use((res) => {
  const { status, statusText, data } = res
  if (status !== 200) {
    throw new CustomError(ErrorCode.TEST, {
      name: 'FetchError',
      message: statusText
    })
  }

  if (data.status_code !== 0) {
    const error = data.data as ErrorData
    throw new CustomError(ErrorCode.PIPELINE, {
      name: error.message,
      message: error.prompts
    })
  }

  return res
})

export type ErrorData = {
  /** 错误信息 */
  message: string
  /** 错误提示语 */
  prompts: string
}

export type SuccessData<T = any> = {
  /** 后台状态码 */
  status_code: number
  extra: {
    /** 后台时间戳 */
    now: number
  }
  data: {
    data: T
  }
}
