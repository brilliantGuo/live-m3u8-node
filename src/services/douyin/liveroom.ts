/**
 * 根据主播直播间，爬取直播间播放链接等相关信息
 * @deprecated 没啥用，废弃了，代码留着备用
 */
import path from 'path'
import { axios } from '@/core/request'
import { TEST_OUTPUT_PATH } from '@/constants/path'
import { writeFile } from '@/utils/file'
import { parseJSONString } from '@/utils/json'

async function getDYLiveHTML(uid: number, cookie: string) {
  const url = `https://live.douyin.com/${uid}`
  const res = await axios.get(url)
  return res.data
}

interface SDKParams {
  VCodec: string
  vbitrate: number
  resolution: string
  gop: number
  drType: string
}

interface PlayUrlInfo {
  main: {
    flv: string
    hls: string
    // 下面几个似乎也是播放链接，但可能为空，没啥用
    // cmaf: string
    // dash: string
    // lls: string
    // tsl: string
    // tile: string
    // 似乎是播放链接相关的含义
    sdk_params: string
  }
}

interface LiveData {
  common: {
    session_id: string
    stream: string
    rule_ids: string
    app_id: string
  }
  data: {
    // ao: auto?
    // origin -> uhd -> hd -> sd -> ld -> md
    origin: PlayUrlInfo
    hd: PlayUrlInfo
    ao: PlayUrlInfo
    sd: PlayUrlInfo
    md: PlayUrlInfo
    uhd: PlayUrlInfo
    ld: PlayUrlInfo
  }
}

type LiveDataKey = keyof LiveData['data']

/**
 * 从 HTML 字符串中解析播放链接等相关信息
 */
function getLiveData(html: string) {
  const regex = /(?<=self\.__pace_f\.push\()([^)]+)/g
  const match = html.match(regex)
  if (!match) return
  const liveData = match
    .map((str, index) => {
      try {
        const val = JSON.parse(str)
        if (Array.isArray(val) && val[1]) {
          const data = JSON.parse(val[1]) as LiveData
          return getPlayUrlInfo(data)
        }
      } catch (error) {
        console.log('parse error', index, str)
        return
      }
    })
    .filter(Boolean)
  return liveData
}

function getPlayUrlInfo(data: LiveData) {
  const keys: LiveDataKey[] = ['origin', 'uhd', 'hd', 'sd', 'ld', 'md']
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!data.data[key]?.main) continue

    const playUrlInfo = data.data[key].main
    const params = parseJSONString<SDKParams>(playUrlInfo.sdk_params)
    const resolution = params?.resolution
    return { key, resolution, playUrl: playUrlInfo.hls || playUrlInfo.flv }
  }
}

// async function main(id: number) {
//   const COOKIE = 'passport_assist_user=Cjyw3tuD4C3k0Pii_3H8tJBQGUPMkFE12t2wHfMqXcO2i4oH0KqLNM-c6X9GFQih0lWtbhe7pw3Vo_WoStEaSgo8hy2T0sfsfhR4W_ZYGfP9Dy8F52DHHmQAG6uqVhK85oZUMJIQSpq8XIsP-J3PLF4OwRSdPZKtr82tBPUHEMGevQ0Yia_WVCABIgED8Xl23A%3D%3D; LOGIN_STATUS=1; bd_ticket_guard_client_web_domain=2; passport_csrf_token=5927156bd9bb340372ae6bbd9fbc706b; passport_csrf_token_default=5927156bd9bb340372ae6bbd9fbc706b; publish_badge_show_info=%220%2C0%2C0%2C1705226630528%22; strategyABtestKey=%221705226631.745%22; stream_player_status_params=%22%7B%5C%22is_auto_play%5C%22%3A0%2C%5C%22is_full_screen%5C%22%3A0%2C%5C%22is_full_webscreen%5C%22%3A0%2C%5C%22is_mute%5C%22%3A1%2C%5C%22is_speed%5C%22%3A1%2C%5C%22is_visible%5C%22%3A1%7D%22; my_rd=2; __live_version__=%221.1.1.7010%22; has_avx2=null; device_web_cpu_core=10; device_web_memory_size=8; live_use_vvc=%22false%22; xgplayer_user_id=563095680683; csrf_session_id=2115de01f203908c06d4e62994ac6f7e; ttcid=246a03c99d724bb0a313df1b97ccd5d636; webcast_leading_last_show_time=1705226679006; webcast_leading_total_show_times=1; download_guide=%223%2F20240114%2F0%22; volume_info=%7B%22isUserMute%22%3Atrue%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.274%7D; pwa2=%220%7C0%7C3%7C0%22; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAAf3kOxUlL8jXP7RY3G8xSTcNnSf977_5pIsP27Wst9I%2F1705248000000%2F0%2F1705226956831%2F0%22; webcast_local_quality=origin; s_v_web_id=verify_lrddaksg_olM1qKsh_6OFx_4gUP_ATEp_SkyfdhZcgYj6; __ac_signature=_02B4Z6wo00f013OuYFwAAIDAIVFAR7GMbcNzjmTAALlTs2IzjXPvQy3FeZiFWc2WbWJS83lQ87NqYQQQT1kH5469yIk1YNE4qB5M19Zq-QPhT56ezg6Ka7tibjHiTOlYgVQuoE3E1ynltrIy29; SEARCH_RESULT_LIST_TYPE=%22single%22; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAAf3kOxUlL8jXP7RY3G8xSTcNnSf977_5pIsP27Wst9I%2F1705248000000%2F1705238779572%2F1705238768094%2F0%22; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1728%2C%5C%22screen_height%5C%22%3A1117%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; home_can_add_dy_2_desktop=%221%22; __ac_nonce=065a3e343002c03551e55; __ac_nonce_15623=065a3e34c000ac7e370bc; __ac_signature_15623=_02B4Z6wo00f01z5vlbwAAIDAbJC1pcoj7lc-T5EAAKpCSmKph.Gd0i6Gbv-IohG4XZTF5FVu25PUMMC9NLM38B0qd1bVGu0jEjkgTmQh0op5H0PCwlwIz-sUZ2RkWmwhBTRzEiNsHzWqbGap40; xg_device_score=7.5279460142267585; live_can_add_dy_2_desktop=%221%22; passport_fe_beating_status=true; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCRnlMMG9xNFoydThXMndzaXdSNnR4OXhPbW5GbzZGN3dSb1BQOG5rTUtKeXJLc1pQa1BlRzNZUkNGSWE2dlZKdjgyTmx4c3VQSi9uSVp1Wlo4d2lmOEE9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ%3D%3D; tt_scid=ZndfCxo5yQlLh.bFxoR5AAinl2qH7Gmubqu-SfML5oHJgyLmiMGRpImjPICX2vT.a775; msToken=3aE3OZxoHpHyMzg8UVmq9DeIrjRHOhP_PvlV9gwYCWMmXHXBXL3RnZqt0xOXD9xdgafyTMHTAW9fbsltTqqpSvGk5PPtGhOnilV0nMCYkpzQrEWmvGY6EfXCx4HKxFEC; IsDouyinActive=true; msToken=zcR8P-WLGTeTM47bwC1Tz9xhWCV-UGADCw0kKH6wyFyoDi8p53CZ2iy-n39bulHbE6KM7I4NbAIUE1jeV9F8kEz3sCQnn7E6Az9PoeinQjpD9t7uQ6vrfDfQfJQwmEIo'
//   const html = await getDYLiveHTML(id, COOKIE)
//   const htmlPath = path.join(TEST_OUTPUT_PATH, `${String(id)}-${Date.now()}.html`)
//   writeFile(htmlPath, html)
//   const liveData = getLiveData(html)
//   console.log('liveData', liveData)
// }

// main(174747779289)
