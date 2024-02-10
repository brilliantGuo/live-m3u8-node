import { Middleware } from 'koa'

export interface DebugOptions {
  name?: string
}

export function debugMiddleware(opts?: DebugOptions): Middleware {
  const { name = 'debugMiddleware' } = opts || {}
  return async (ctx, next) => {
    console.log(`[${name}].start`)
    try {
      await next()
    } catch (error) {
      console.log(`[${name}].error`, error)
    }
    console.log(`[${name}].end`)
    const { state, query, params, request, message, method, headers, ip, ips } = ctx
    ctx.body = {
      method,
      message,
      body: request.body,
      params,
      query,
      state,
      headers,
      ip,
      ips,
      response: ctx.body
      // cookies 是个对象，不能直接输出 body
      // cookies
    }
  }
}
