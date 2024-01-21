import path from 'path'

// 项目目录
export const PROJECT_DIR = path.join(__dirname, '..', '..')
// 日志存储目录
export const LOG_FILENAME = path.join(PROJECT_DIR, 'logs', 'run.log')
// m3u8 文件输出路径名
export const M3U8_OUTPUT_PATH = path.join(PROJECT_DIR, 'static', 'm3u8s')
// 测试用文件输出路径名
export const TEST_OUTPUT_PATH = path.join(PROJECT_DIR, 'static', 'test')
