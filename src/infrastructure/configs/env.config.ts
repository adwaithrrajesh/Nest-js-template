import * as dotenv from 'dotenv';
import * as path from 'path';

type NodeEnv = 'local' | 'development' | 'production';

// specify your ENV HERE
const REQUIRED_VARS = [
  'PORT',
  'DATABASE_URL',
  'CORS_ORIGIN',
  'COOKIE_SECRET',
  'JWT_SECRET'
] as const;
type EnvVar = (typeof REQUIRED_VARS)[number];

// 1️⃣ Load default .env to get NODE_ENV first
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// 2️⃣ Get NODE_ENV from process.env
const nodeEnv = process.env.NODE_ENV as NodeEnv | undefined;
if (!nodeEnv) {
  throw new Error(`❌ NODE_ENV is not defined in .env`);
}
if (!['local', 'development', 'production'].includes(nodeEnv)) {
  throw new Error(`❌ Invalid NODE_ENV: ${nodeEnv}`);
}

// 3️⃣ Load environment-specific .env file
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${nodeEnv}`),
  override: true,
});

// 4️⃣ Validate all required variables
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(
    `❌ Missing environment variables in .env.${nodeEnv}: ${missing.join(', ')}`,
  );
}

// 5️⃣ Build env object
export const env = REQUIRED_VARS.reduce(
  (acc, key) => {
    const raw = process.env[key]!;
    let value: string | number | string[] = raw;

    if (key === 'PORT') value = Number(raw);
    if (key === 'CORS_ORIGIN') value = raw.split(',').map((v) => v.trim());

    acc[key] = value;
    return acc;
  },
  {} as Record<EnvVar, string | number | string[]> & {
    isLocal: boolean;
    isDevelopment: boolean;
    isProduction: boolean;
  },
);

// 6️⃣ Convenience flags
env.isLocal = nodeEnv === 'local';
env.isDevelopment = nodeEnv === 'development';
env.isProduction = nodeEnv === 'production';
