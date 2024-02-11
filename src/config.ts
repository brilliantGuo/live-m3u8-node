import * as dotenv from 'dotenv'

dotenv.config()

export const { PORT, NODE_ENV } = process.env
export const IS_PROD = NODE_ENV === 'production'
export const IS_PM2 = Boolean(process.env.IS_PM2)
export const PM_ID = process.env.pm_id || '-'
