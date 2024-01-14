import { IMiddleware } from 'koa-router'
import { homeController } from './controllers/home'

interface Route {
  path: string
  method: 'get' | 'post' | 'put' | 'delete'
  action: IMiddleware
}

const routes: Route[] = [
  {
    path: '/',
    method: 'get',
    action: homeController.hello
  }
]

export default routes
