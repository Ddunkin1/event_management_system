import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const result = await pool.query(
      `
      SELECT 
        event_id AS id, 
        event_name, 
        event_description, 
        event_date, 
        event_location, 
        user_id, 
        event_category, 
        status,
        users.email
      FROM events
      LEFT JOIN users ON events.user_id = users.id
      WHERE status = 'pending'
      `
    );
    console.log("Fetched events from DB:", result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error in get-events route:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch events: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}