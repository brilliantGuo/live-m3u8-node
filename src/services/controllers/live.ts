import path from 'path'
import { ConfigInfo, LiveInfo, LiveService, UserConfig } from '@/core/interfaces'
import { USER_CONFIG_PATH, M3U8_OUTPUT_PATH } from '@/constants/path'
import { isExists, writeFile } from '@/utils/file'
import { getConfigInfoFromFile, getFileConfigs, getM3u8Content } from '../stdio'
import { DouyinService } from '../douyin'
import { flatten } from '@/utils/array'
import { Platform } from '@/constants/platform'

export interface LiveControllerOptions {
  /** 指定读取配置的文件名，不传则拉取 static/configs 下所有文件配置 */
  fileName?: string
  /** 输出的文件格式，注意仅有指定 fileName 且 outputType='m3u8' 时，才会返回 m3u8 内容 */
  outputType?: 'json' | 'm3u8'
  /** 是否要输出成文件，不传则不写入文件 */
  outputFile?: boolean
}

export class LiveController {
  private static platforms: Platform[] = [Platform.Douyin]
  /**
   * 配置文件对应的
   */
  private static serviceMap: { [key in Platform]: LiveService } = {
    douyin: DouyinService
  }

  /**
   * 获取直播间信息的上层封装。
   *
   * @param opts 配置选项
   * @returns
   */
  static getLiveInfos = async (opts?: LiveControllerOptions) => {
    const { fileName, outputFile = false, outputType = 'json' } = opts || {}
    const configs = await LiveController.getFileConfig(fileName)
    if (!configs) return

    const isOutputM3u8 = outputType === 'm3u8'
    const tasks = configs.map(async (config) => {
      const { fileName } = config
      const liveInfos = await LiveController.getLiveInfosFromConfigInfo(config)
      const content = isOutputM3u8 ? getM3u8Content(liveInfos) : JSON.stringify(liveInfos, null, 2)
      if (outputFile) {
        const outputFile = path.join(M3U8_OUTPUT_PATH, `${fileName}.${outputType}`)
        await writeFile(outputFile, content)
      }
      return liveInfos
    })
    const res = await Promise.all(tasks)
    const liveInfos = flatten(res)
    return isOutputM3u8 ? getM3u8Content(liveInfos) : liveInfos
  }

  /**
   * 读取 static/configs 下的 YAML 配置文件
   * @param fileName 文件名，不用带后缀，会自动补全 yaml
   * @returns
   */
  private static getFileConfig = async (fileName?: string) => {
    if (!fileName) return getFileConfigs()
    const filePath = path.join(USER_CONFIG_PATH, `${fileName}.yaml`)
    if (!isExists(filePath)) return
    const config = await getConfigInfoFromFile(filePath)
    return config ? [config] : undefined
  }

  /**
   * 根据 ConfigInfo 获取对应的直播间信息
   * @param fileConfig {ConfigInfo} 配置文件信息
   * @returns {Promise<LiveInfo[]>} 开播直播间的信息
   */
  private static getLiveInfosFromConfigInfo = async (fileConfig: ConfigInfo) => {
    const { config } = fileConfig
    const tasks = LiveController.platforms.map((platform) => {
      const liveService = LiveController.serviceMap[platform]
      const serviceConfig = config[platform]
      if (!serviceConfig) return [] as LiveInfo[]
      return liveService.getLiveInfos(serviceConfig)
    })
    const res = await Promise.all(tasks)
    return flatten(res)
  }
}
