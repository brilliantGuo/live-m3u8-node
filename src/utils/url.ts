
// a=1&b=2 获取 query
export function getStringQuery(str: string, splitSymbol = '&') {
  return str.split(splitSymbol).reduce<Record<string, string>>((obj, str) => {
    const [key, value] = str.split('=')
    return { ...obj, [key]: value }
  }, {})
}

// 根据 url schema 获取 query
export function getUrlQuery(url: string) {
  const [baseUrl, query] = url.split('?')
  return getStringQuery(query)
}

// query 转 string
export function getQueryString(query: Record<string, any>) {
  return Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
}
