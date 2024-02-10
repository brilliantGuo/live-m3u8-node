import Router, { IMiddleware } from 'koa-router'
import { Logger } from '@/core/logger'
import { LiveController, LiveControllerOptions } from '@/services'

interface RouterState {
  outputType?: LiveControllerOptions['outputType']
}

type LiveMiddleware = IMiddleware<RouterState>

const router = new Router<RouterState>()
const logger = new Logger('LiveRouter')

function getOutputType(type?: string): LiveControllerOptions['outputType'] {
  if (type === 'json') return 'json'
  return 'm3u8'
}

function getFileInfo(
  fileName?: string | string[],
  outputType?: string
): Pick<LiveControllerOptions, 'fileName' | 'outputType'> {
  if (!fileName) return { fileName, outputType: getOutputType(outputType) }
  const configName = Array.isArray(fileName) ? fileName[0] : fileName
  const [name, type] = configName.split('.')
  return {
    fileName: name,
    outputType: getOutputType(outputType || type)
  }
}

const jsonMiddleware: LiveMiddleware = async (ctx, next) => {
  ctx.state.outputType = 'json'
  await next()
}

const m3u8Middleware: LiveMiddleware = async (ctx, next) => {
  ctx.state.outputType = 'm3u8'
  await next()
}

const liveMiddleware: LiveMiddleware = async (ctx) => {
  const { query, params, state } = ctx
  const { disableOutput } = params
  const { fileName, outputType: fileOutputType } = getFileInfo(params.fileName, params.outputType)
  const outputType = state.outputType || fileOutputType
  logger.log('liveMiddleware', { params, query, state, fileName, fileOutputType, outputType })
  const data = await LiveController.getLiveInfos({ fileName, outputType, outputFile: !disableOutput })
  logger.log('liveMiddleware.getLiveInfos.data', data)
  if (outputType === 'm3u8' && typeof data === 'string') {
    ctx.set({
      'accept-ranges': 'bytes',
      'content-type': 'application/vnd.apple.mpegurl',
      'content-length': String(data.length)
    })
    ctx.body = data
    return
  }
  ctx.body = { code: 0, data }
}

router.get('/', liveMiddleware)
router.get('/json', jsonMiddleware, liveMiddleware)
router.get('/json/:fileName', jsonMiddleware, liveMiddleware)
router.get('/m3u8', m3u8Middleware, liveMiddleware)
router.get('/m3u8/:fileName', m3u8Middleware, liveMiddleware)
router.get('/file/:fileName', liveMiddleware)

export default router
