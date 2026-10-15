import {Pool} from 'pg'

//Stores a shared connection pool. A pool manages reusable database connections so each request doesn’t need to create and close a connection from scratch.
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {  //lazy initialization, creating something only when it’s first needed
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not set here");
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}