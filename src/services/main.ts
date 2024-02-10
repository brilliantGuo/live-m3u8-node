import { LiveController } from './controllers/live'

LiveController.getLiveInfos({
  outputFile: true,
  outputType: 'm3u8',
}).then(liveInfos => {
  console.log('liveInfos', liveInfos)
})
