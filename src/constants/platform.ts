/**
 * 支持爬取的平台，注意枚举的值对应用户配置的字段
 */
export enum Platform {
  Douyin = 'douyin'
}

export const PLATFORM_NAME: {
  [key in Platform]: string
} = {
  [Platform.Douyin]: '抖音'
};
