import Router from 'koa-router'
import LiveRouter from './live'
import HelloWorldRouter from './hello'

export const ROUTERS: Router[] = [
  HelloWorldRouter,
  LiveRouter,
]
