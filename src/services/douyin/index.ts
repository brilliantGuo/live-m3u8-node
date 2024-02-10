import { LiveService, LiveInfo } from '@/core/interfaces'
import { flatten } from '@/utils/array'
import { getFollowLiveInfos } from './follow'
import { logger } from './base'

export const DouyinService: LiveService = {
  async getLiveInfos(config) {
    const tasks: Promise<LiveInfo[]>[] = []
    if (config.cookies) {
      const follows = config.cookies.map((cookie, index) =>
        getFollowLiveInfos(cookie).catch((error) => {
          logger.error('DouyinService.getLiveInfos.error', { cookie, index, error })
          return [] as LiveInfo[]
        })
      )
      tasks.push(...follows)
    }
    // TODO 根据用户 id 获取用户开播信息待开发
    // if (config.users)

    const res = await Promise.all(tasks)
    return flatten(res)
  }
}
