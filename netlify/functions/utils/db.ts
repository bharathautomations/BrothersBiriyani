import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let cachedSql: NeonQueryFunction<false, false> | null = null;

/**
 * Lazily creates (and reuses across warm invocations) a Neon/PostgreSQL client.
 * The connection string is read only from server-side environment variables -
 * it is never bundled into frontend code or committed to source control.
 */
export function getSqlClient(): NeonQueryFunction<false, false> {
  if (cachedSql) return cachedSql;

  const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'Database connection is not configured. Set NETLIFY_DATABASE_URL (or DATABASE_URL) as a Netlify environment variable.'
    );
  }

  cachedSql = neon(connectionString);
  return cachedSql;
}
