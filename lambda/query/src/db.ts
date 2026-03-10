import fs from 'node:fs';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './dbTypes';
import bundledCaCert from '../certs/global-bundle.pem';

const dbCaPath = process.env.DB_CA_PATH ?? process.env.DB_SSLROOTCERT;
let ca: string | undefined;

if (dbCaPath) {
  try {
    ca = fs.readFileSync(dbCaPath, 'utf8');
  } catch (error) {
    console.warn(
      `Could not read cert at ${dbCaPath}, falling back to bundled cert.`,
      error,
    );
    ca = bundledCaCert;
  }
}

const ssl = ca
  ? {
      ca,
      rejectUnauthorized: true,
    }
  : undefined;

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

