import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import { PORT } from './config'
import { ROUTERS } from './routes'
import { errorHandlerMiddleware } from './middlewares'

const app = new Koa()

app.use(errorHandlerMiddleware())
app.use(logger())
app.use(bodyParser())
ROUTERS.forEach(router => {
  app.use(router.routes())
  app.use(router.allowedMethods())
})
app.listen(PORT)
console.log(`应用启动成功 端口:${PORT}`)
