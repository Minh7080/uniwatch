import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
});

export const env = envSchema.parse(process.env);
export default env;
