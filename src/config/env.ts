import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({
  quiet: process.env.NODE_ENV === 'test', // Không log lỗi nếu đã có biến môi trường NODE_ENV là test (để tránh log lỗi khi chạy test)
})

const schema = z.object({
  NODE_ENV: z.enum(['development','test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.url(),
  LOG_LEVEL: z.string().default('info'),
  CORS_ORIGINS: z.string(),
  FRONTEND_BASE_URL: z.url(),
})

export const env = schema.parse(process.env)
