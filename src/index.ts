import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { PROJECT_DIR } from './constants/path'
import { PORT, NODE_ENV, IS_PM2 } from './config'
import { logger } from './core/logger'
import { ROUTERS } from './routes'
import { debugMiddleware, errorHandlerMiddleware, loggerMiddleware } from './middlewares'

process.on('SIGINT', () => {
  logger.log('process.on.SIGINT, now exit.')
  process.exit(0);
});

const app = new Koa()

app.use(loggerMiddleware())
app.use(errorHandlerMiddleware())
app.use(debugMiddleware())
app.use(bodyParser())
ROUTERS.forEach((router) => {
  app.use(router.routes())
  app.use(router.allowedMethods())
})
app.listen(PORT)
logger.log(`应用启动成功！`, { PROJECT_DIR, PORT, NODE_ENV, IS_PM2 })
