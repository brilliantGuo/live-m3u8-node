import Router from 'koa-router'
import { debugMiddleware } from '@/middlewares'

const router = new Router({
  prefix: '/hello'
})

const debugRoute = debugMiddleware({ force: true });
router.get('/', (ctx) => {
  ctx.body = 'hello world'
})
router.get('/info', debugRoute)
router.get('/info/:id', debugRoute)
router.get('/error', () => {
  throw new Error('Hello World!')
})

export default router
