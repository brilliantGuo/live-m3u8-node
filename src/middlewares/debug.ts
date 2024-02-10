import { Middleware } from 'koa'

export interface DebugOptions {
  name?: string
  force?: boolean
}

export function debugMiddleware(opts?: DebugOptions): Middleware {
  const { force } = opts || {}
  return async (ctx, next) => {
    await next()
    const isDebug = ctx.query.debug === '1' || force
    if (!isDebug) return
    const {
      method,
      message,
      request,
      params,
      query,
      state,
      headers,
      ip,
      ips,
      origin,
      originalUrl,
      path,
    } = ctx
    const res = {
      method,
      message,
      body: request.body,
      params,
      query,
      state,
      headers,
      ip,
      ips,
      origin,
      originalUrl,
      path,
      response: ctx.body
      // cookies 是个对象，不能直接输出 body
      // cookies
    }
    ctx.body = res
  }
}
