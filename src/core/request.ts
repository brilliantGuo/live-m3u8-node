import Axios, { CreateAxiosDefaults } from 'axios'

export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export const AXIOS_DEFAULT_CONFIG: CreateAxiosDefaults = {
  headers: {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'cache-control': 'max-age=0',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'upgrade-insecure-requests': '1',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
}

/**
 * 模拟浏览器真实请求
 */
export const axios = Axios.create(AXIOS_DEFAULT_CONFIG)

// Headers 携带 Referer 参数，与请求链接相同
axios.interceptors.request.use((config) => {
  config.headers.Referer = config.url
  return config
})
