import Router from 'koa-router'
import { debugMiddleware } from '@/middlewares'

const router = new Router({
  prefix: '/hello'
})

router.get('/', (ctx) => {
  ctx.body = 'hello world'
})
router.get('/info', debugMiddleware())
router.get('/info/:id', debugMiddleware())

export default router
