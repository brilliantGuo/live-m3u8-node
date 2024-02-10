import yaml from 'js-yaml'
import { USER_CONFIG_PATH } from '@/constants/path'
import { UserConfig, ConfigInfo } from '@/core/interfaces'
import { readFile, walkDir } from '@/utils/file'

interface PathInfo {
  dir: string
  fileName: string
}

function getPathInfo(pathStr: string): PathInfo {
  const fileNameExec = /.*\/(.*?)\..*$/.exec(pathStr)
  if (!fileNameExec) return { dir: pathStr, fileName: '' }
  const fileName = fileNameExec[1]
  const dir = pathStr.replace(`/${fileName}`, '')
  return { dir, fileName }
}

export async function getUserConfig(filePath: string) {
  const content = await readFile(filePath)
  const config = yaml.load(content)
  return config as UserConfig
}

/**
 * 指定文件路径，返回 ConfigInfo 配置文件信息。
 * 注意此方法不会对文件内容做校验，因此传入的路径文件需要符合 ConfigInfo 格式。
 *
 * @param filePath 文件路径
 * @returns
 */
export async function getConfigInfoFromFile(filePath: string): Promise<ConfigInfo | undefined> {
  const pathInfo = getPathInfo(filePath)
  const config = await getUserConfig(filePath)
  if (!config) return
  return { ...pathInfo, config }
}

/**
 * 遍历 static/configs 下的所有配置文件，返回配置文件信息
 */
export async function getFileConfigs() {
  const files = await walkDir(USER_CONFIG_PATH, {
    ignores: ['.gitkeep']
  })
  const tasks = files.map(getConfigInfoFromFile)
  const res = await Promise.all(tasks)
  const configs = res.filter(Boolean) as ConfigInfo[]
  return configs
}

// async function main() {
//   const configs = await getFileConfigs()
//   console.log('configs', configs)
// }

// main()
