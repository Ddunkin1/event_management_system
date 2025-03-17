import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ztm",
  password: "admin1231",
  port: 5432,
});

pool.on("connect", () => {
  console.log("Database connected successfully!");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err.stack);
});

export default async function query(text, params) {
  try {
    const result = await pool.query(text, params || []);
    return result;
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}