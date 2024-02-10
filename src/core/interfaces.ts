import { Platform } from '@/constants/platform'

/**
 * 获取直播间所需信息
 */
export interface LiveInfo {
  /** 直播平台名字 */
  platform: Platform;
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
 * Service 层需要收到的数据字段，通过这些字段去拉取相关接口
 */
export interface ServiceConfig {
  /** 用户的登录态，以 cookie 为主，通过 cookie 调用后端接口获取关注主播相关数据 */
  cookie?: string
  /** 需要拉取的用户的 uid，根据这些字段拉取用户开播信息 */
  users?: string[]
}

/**
 * 定义用户填写的配置信息，以 static/config/*.yaml 配置为准
 */
export interface UserConfig {
  [Platform.Douyin]?: ServiceConfig
}

/**
 * 配置文件信息
 */
export interface ConfigInfo {
  dir: string
  fileName: string
  config: UserConfig
}

/**
 * 定义直播 Service 需要实现的功能
 */
export interface LiveService {
  /** 获取根据 cookie 关注主播和特定用户 uid 的直播信息的接口 */
  getLiveInfos: (config: ServiceConfig) => Promise<LiveInfo[]>;
}
