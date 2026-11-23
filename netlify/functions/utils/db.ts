import postgres from 'postgres';

type Row = Record<string, any>;

/** Supports both sql`SELECT ... ${value}` and sql('SELECT ... $1', [value]). */
export interface SqlClient {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Row[]>;
  (query: string, params?: unknown[]): Promise<Row[]>;
}

let cachedSql: SqlClient | null = null;

/**
 * Lazily creates (and reuses across warm invocations) a Postgres client for Supabase.
 * The connection string is read only from server-side environment variables -
 * it is never bundled into frontend code or committed to source control.
 */
export function getSqlClient(): SqlClient {
  if (cachedSql) return cachedSql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'Database connection is not configured. Set DATABASE_URL (Supabase connection pooler string) as a Netlify environment variable.'
    );
  }

  // prepare:false is required by Supabase's transaction pooler; max:1 suits serverless.
  const client = postgres(connectionString, {
    ssl: 'require',
    prepare: false,
    max: 1,
    idle_timeout: 20,
  });

  cachedSql = ((first: TemplateStringsArray | string, ...rest: unknown[]) => {
    if (typeof first === 'string') {
      return client.unsafe(first, (rest[0] ?? []) as any[]);
    }
    return (client as any)(first, ...rest);
  }) as unknown as SqlClient;

  return cachedSql;
}
