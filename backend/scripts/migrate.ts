import { config } from "dotenv";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closePool, getPool } from "../src/db/pool";

//1. Loads environment variables
config({ path: resolve(process.cwd(), ".env") });

//2. Finds and sorts SQL files
async function main() {
  const sqlDir = resolve(process.cwd(), "sql");
  const files = readdirSync(sqlDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

    //3. Executes each file
  const pool = getPool();

  for (const file of files) {
    const sql = readFileSync(resolve(sqlDir, file), "utf-8");
    await pool.query(sql);

    console.log(`Migrated: sql/${file}`);
  }

  //4. Closes the database connections
  await closePool();
}

//5. Reports failures
main().catch((err) => {
  console.error(err);
  process.exit(1);
});