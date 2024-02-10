import * as dotenv from 'dotenv'

dotenv.config()

export const { PORT, NODE_ENV } = process.env
export const IS_PROD = NODE_ENV === 'production'

