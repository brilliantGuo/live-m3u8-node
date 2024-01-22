import path from 'path'
import { writeFile } from '@/utils/file'
import { getFileConfigs, getM3u8Content } from './stdio'
import * as DouYin from './douyin'
import { LiveInfo } from '@/core/interfaces'
import { M3U8_OUTPUT_PATH } from '@/constants/path'

async function main() {
  const configs = await getFileConfigs()
  const tasks = configs.map(async fileConfig => {
    const { config, fileName } = fileConfig
    const tasks: Promise<LiveInfo | LiveInfo[]>[] = []
    if (config.douyin.cookie) {
      console.log('start getFollowLiveInfos', config.douyin.cookie)
      tasks.push(DouYin.getFollowLiveInfos(config.douyin.cookie))
    }

    const res = await Promise.all(tasks)
    const liveInfos = res.reduce<LiveInfo[]>((infos, val) => {
      const info = Array.isArray(val) ? val : [val]
      return [...infos, ...info]
    }, [])
    console.log('liveInfos', liveInfos)
    const m3u8Content = getM3u8Content(liveInfos)
    const outputFile = path.join(M3U8_OUTPUT_PATH, `${fileName}.m3u8`)
    return writeFile(outputFile, m3u8Content)
  })

  await Promise.all(tasks)
  console.log('done!')
}

main()
