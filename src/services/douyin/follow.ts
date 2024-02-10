/**
 * 根据个人 Cookie 获取关注且已开播的主播的直播间信息
 */
import { Platform } from '@/constants/platform'
import { axios, SuccessData } from './base'
import { LiveInfo } from '@/core/interfaces'

type FollowInfo = {
  /** 房间 id */
  web_rid: string
  room: {
    title: string
    id_str: string
    cover: {
      url_list: string[]
    }
    stream_url: {
      default_resolution: string
      hls_pull_url: string
      hls_pull_url_map: {
        FULL_HD1: string
        HD1: string
        SD1: string
        SD2: string
      }
      flv_pull_url_map: {
        FULL_HD1: string
        HD1: string
        SD1: string
        SD2: string
      }
    }
    owner: {
      // 头像链接
      avatar_thumb: {
        url_list: string[]
      }
      nickname: string
      // 用户 id
      sec_uid: string
    }
  }
}

async function getFollowInfo(cookie: string) {
  const res = await axios.get<SuccessData<FollowInfo[]>>('https://www.douyin.com/webcast/web/feed/follow', {
    headers: {
      cookie
    },
    params: {
      // 接口必须要带上此参数
      scene: 'aweme_pc_follow_top'
    }
  })

  return res.data.data.data
}

function getLiveInfo(followInfo: FollowInfo): LiveInfo {
  const { room } = followInfo
  const { stream_url: streamUrl, owner } = room
  const liveInfo = streamUrl.hls_pull_url_map || streamUrl.flv_pull_url_map
  return {
    platform: Platform.Douyin,
    roomInfo: {
      id: followInfo.web_rid,
      title: room.title,
      cover: room.cover.url_list[0]
    },
    userInfo: {
      id: owner.sec_uid,
      nickname: owner.nickname,
      avatar: owner.avatar_thumb.url_list[0]
    },
    liveUrlInfo: {
      origin: liveInfo.FULL_HD1,
      ultraHd: liveInfo.HD1,
      hd: liveInfo.SD1,
      sd: liveInfo.SD2
    }
  }
}

/**
 * 根据传入的 cookie 获取直播间信息
 */
export async function getFollowLiveInfos(cookie: string): Promise<LiveInfo[]> {
  const followInfo = await getFollowInfo(cookie)
  const liveInfos = followInfo.map(getLiveInfo)
  return liveInfos
}

// async function main() {
//   const COOKIE = 'ttwid=1%7CBOJb9xfyraVLSIreqfsCUPPWeA_eFAyBSACpHTiGyVc%7C1686375072%7Cc1d8cc74cee4814cd58b08e0b8ba62c9600ebf1f98ab047a8949a6f850672804; d_ticket=152a58bb7c35dab3c94a80ef76a8914a80a5d; passport_assist_user=Cjyw3tuD4C3k0Pii_3H8tJBQGUPMkFE12t2wHfMqXcO2i4oH0KqLNM-c6X9GFQih0lWtbhe7pw3Vo_WoStEaSgo8hy2T0sfsfhR4W_ZYGfP9Dy8F52DHHmQAG6uqVhK85oZUMJIQSpq8XIsP-J3PLF4OwRSdPZKtr82tBPUHEMGevQ0Yia_WVCABIgED8Xl23A%3D%3D; n_mh=N8xL_Hvy4DjJCRgZTtZY6KQ2UPI57QHXPKM5n447Occ; sso_uid_tt=4716bc5a55fd87e660e7c1595a33f8b1; sso_uid_tt_ss=4716bc5a55fd87e660e7c1595a33f8b1; toutiao_sso_user=0372f15c17b61ebdeb68922574890c63; toutiao_sso_user_ss=0372f15c17b61ebdeb68922574890c63; LOGIN_STATUS=1; store-region=cn-gd; store-region-src=uid; bd_ticket_guard_client_web_domain=2; uid_tt=889ff298a0ba6c980f903824bfab79bb; uid_tt_ss=889ff298a0ba6c980f903824bfab79bb; sid_tt=5c822f4afe7c8b0e91206f286a5cb2e2; sessionid=5c822f4afe7c8b0e91206f286a5cb2e2; sessionid_ss=5c822f4afe7c8b0e91206f286a5cb2e2; s_v_web_id=verify_lq8z5jaq_rHq26FvM_vGYo_40aG_9wTf_HaKiryD5sqUN; passport_csrf_token=5927156bd9bb340372ae6bbd9fbc706b; passport_csrf_token_default=5927156bd9bb340372ae6bbd9fbc706b; publish_badge_show_info=%220%2C0%2C0%2C1705226630528%22; sid_ucp_sso_v1=1.0.0-KGRkZmFlOTc1OGJiMGViNTY4YjI3OGZkYzE1MDMwN2NiMTc3NDc0NDkKHQjL0P3AiQIQh-OOrQYY7zEgDDCWsNbOBTgCQPEHGgJsZiIgMDM3MmYxNWMxN2I2MWViZGViNjg5MjI1NzQ4OTBjNjM; ssid_ucp_sso_v1=1.0.0-KGRkZmFlOTc1OGJiMGViNTY4YjI3OGZkYzE1MDMwN2NiMTc3NDc0NDkKHQjL0P3AiQIQh-OOrQYY7zEgDDCWsNbOBTgCQPEHGgJsZiIgMDM3MmYxNWMxN2I2MWViZGViNjg5MjI1NzQ4OTBjNjM; stream_player_status_params=%22%7B%5C%22is_auto_play%5C%22%3A0%2C%5C%22is_full_screen%5C%22%3A0%2C%5C%22is_full_webscreen%5C%22%3A0%2C%5C%22is_mute%5C%22%3A1%2C%5C%22is_speed%5C%22%3A1%2C%5C%22is_visible%5C%22%3A1%7D%22; sid_guard=5c822f4afe7c8b0e91206f286a5cb2e2%7C1705226632%7C5184000%7CThu%2C+14-Mar-2024+10%3A03%3A52+GMT; sid_ucp_v1=1.0.0-KGIzZmRmMDI1ZTA0YzlhNjQxNjE5YWE0YzAwNjRkNDEyZmUyNzQ4ZjIKGQjL0P3AiQIQiOOOrQYY7zEgDDgCQPEHSAQaAmxxIiA1YzgyMmY0YWZlN2M4YjBlOTEyMDZmMjg2YTVjYjJlMg; ssid_ucp_v1=1.0.0-KGIzZmRmMDI1ZTA0YzlhNjQxNjE5YWE0YzAwNjRkNDEyZmUyNzQ4ZjIKGQjL0P3AiQIQiOOOrQYY7zEgDDgCQPEHSAQaAmxxIiA1YzgyMmY0YWZlN2M4YjBlOTEyMDZmMjg2YTVjYjJlMg; my_rd=2; live_use_vvc=%22false%22; download_guide=%223%2F20240114%2F0%22; volume_info=%7B%22isUserMute%22%3Atrue%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.274%7D; pwa2=%220%7C0%7C3%7C0%22; SEARCH_RESULT_LIST_TYPE=%22single%22; dy_swidth=1728; dy_sheight=1117; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1728%2C%5C%22screen_height%5C%22%3A1117%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A10%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; __ac_signature=_02B4Z6wo00f01cwu9NwAAIDCntHUxLDWJoXMDvBAABaxhjiAQ80XX0ZAVZIuuoiOveCrtWojJoyE73XX-Awm0VawM5aJpOwQ2QeleKEZ3tyOu1hI7gHeDbwYabLq7Ajw.5n3bgDm2PLLyvB940; strategyABtestKey=%221705252505.716%22; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAAf3kOxUlL8jXP7RY3G8xSTcNnSf977_5pIsP27Wst9I%2F1705334400000%2F1705252857205%2F1705252855153%2F0%22; __live_version__=%221.1.1.7304%22; live_can_add_dy_2_desktop=%221%22; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAAf3kOxUlL8jXP7RY3G8xSTcNnSf977_5pIsP27Wst9I%2F1705852800000%2F1705817796334%2F1705817786739%2F0%22; douyin.com; device_web_cpu_core=10; device_web_memory_size=8; csrf_session_id=e50a416ac2f5d3ef25f4015f75d8f7a1; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCRnlMMG9xNFoydThXMndzaXdSNnR4OXhPbW5GbzZGN3dSb1BQOG5rTUtKeXJLc1pQa1BlRzNZUkNGSWE2dlZKdjgyTmx4c3VQSi9uSVp1Wlo4d2lmOEE9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ%3D%3D; home_can_add_dy_2_desktop=%221%22; tt_scid=31OCsA5cc2dUPcMH9cQLuUEW6yXlwA7SiQjbWOToBJ1BZ6H3nMwvhaVTnWeFPXjV382a; xg_device_score=7.750418532313436; odin_tt=9bf6e155e1a176460380c2c2d7a4708ccad3b624aab5bbeab109fa692c30f2183bc3e5b6ecc9831eb975e91d2e7f68fd; msToken=AAMVrgDif9Kihn_XoasqPFx_w5HrDFGK0EucXtTyfSPtKH0uA8j3uBtn_HOTptIrKhXej___Hdu74ooQSvpz7vOAEb_XT6Tx4Dhp7Ip0gSnGudYeb-i1iR09o6brjFnd; passport_fe_beating_status=true; IsDouyinActive=true; msToken=_Crf2g9Qk1IULc8qTWyk1gIlK5S4wuJB205-UpZ69vyoZ6olj_Fe_1KdPd8eZXdznqLKTPsMhtLE8wBHhmax8MOFwTHzVCZS1cBXftr2owH6DR_aHmTevztgVMIMkBSd'
//   const liveInfos = await getFollowLiveInfos(COOKIE)
//   console.log('main.data', liveInfos.length, liveInfos)
// }

// main()
