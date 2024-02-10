import { LiveService, LiveInfo } from '@/core/interfaces'
import { flatten } from '@/utils/array'
import { getFollowLiveInfos } from './follow'

export const DouyinService: LiveService = {
  async getLiveInfos(config) {
    const tasks: Promise<LiveInfo[]>[] = []
    if (config.cookie) tasks.push(getFollowLiveInfos(config.cookie))
    // TODO 根据用户 id 获取用户开播信息待开发
    // if (config.users)

    const res = await Promise.all(tasks)
    return flatten(res)
  }
}
