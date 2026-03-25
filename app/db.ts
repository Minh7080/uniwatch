import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './dbTypes';
import bundledCaCert from '../certs/global-bundle.pem';

const ssl = {
  ca: bundledCaCert,
  rejectUnauthorized: true,
};

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'postgres',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS,
  ssl,
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});

