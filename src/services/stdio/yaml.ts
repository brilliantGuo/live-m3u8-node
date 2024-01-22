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

async function readUserConfig(filePath: string) {
  const content = await readFile(filePath)
  const config = yaml.load(content)
  return config as UserConfig
}

/**
 * 遍历 static/configs 下的所有配置文件，返回配置文件信息
 */
export async function getFileConfigs() {
  const files = await walkDir(USER_CONFIG_PATH, {
    ignores: ['.gitkeep']
  })
  const tasks = files.map(async (filePath) => {
    const pathInfo = getPathInfo(filePath)
    const config = await readUserConfig(filePath)
    if (!config) return
    return { ...pathInfo, config }
  })
  const res = await Promise.all(tasks)
  const configs = res.filter(Boolean) as ConfigInfo[]
  return configs
}

// async function main() {
//   const configs = await getFileConfigs()
//   console.log('configs', configs)
// }

// main()
