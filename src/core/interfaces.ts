/**
 * 获取直播间所需信息
 */
export interface LiveInfo {
  /** 直播间相关信息 */
  roomInfo: {
    /** 直播 ID */
    id: string
    /** 直播间标题 */
    title: string
    /** 直播间封面 */
    cover: string
  }
  /** 主播相关信息 */
  userInfo: {
    /** 主播 ID */
    id: string
    /** 主播名字 */
    nickname: string
    /** 主播头像 URL */
    avatar: string
  }
  /** 直播间推流链接 */
  liveUrlInfo: {
    /** 原画 */
    origin: string
    /** 超高清 / 蓝光 */
    ultraHd: string
    /** 高清 */
    hd: string
    /** 标清 */
    sd: string
  }
}

/**
 * 配置信息
 */
export interface UserConfig {
  douyin: {
    cookie?: string
    users?: string[]
  }
}

/**
 * 配置文件信息
 */
export interface ConfigInfo {
  dir: string
  fileName: string
  config: UserConfig
}
