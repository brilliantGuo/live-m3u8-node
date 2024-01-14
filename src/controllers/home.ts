import { HomeService } from '../services/home'

class HomeController {
  private service: HomeService = new HomeService()

  hello = async (ctx) => {
    ctx.body = await this.service.hello()
  }
}

export const homeController = new HomeController()
