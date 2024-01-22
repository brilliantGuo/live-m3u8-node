import { LiveInfo } from '@/core/interfaces'

/**
 * 根据单个直播间信息返回 m3u8 片段
 * @param liveInfo 单个直播间信息
 * @returns m3u8 直播间片段
 */
function getM3u8Snippet(liveInfo: LiveInfo) {
  const { liveUrlInfo, userInfo, roomInfo } = liveInfo;
  const { origin, ultraHd, hd, sd } = liveUrlInfo
  const group = '抖音'
  const title = `(${userInfo.nickname})${roomInfo.title}`
  const url = origin || ultraHd || hd || sd
  return `#EXTINF:-1 tvg-logo="${roomInfo.cover}" group-title="${group}", ${title}\n${url}`
}

/**
 * 根据直播间信息返回 m3u8 内容
 * @param liveInfos 直播间信息
 * @returns {string} M3u8 文本内容
 */
export function getM3u8Content(liveInfos: LiveInfo[]) {
  const content = liveInfos.map(getM3u8Snippet).join('\n')
  return `#EXTM3U\n${content}`
}
