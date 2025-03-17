import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres", 
  host: "localhost",
  database: "ztm", 
  password: "admin1231",
  port: 5432,
});


pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully!");
  }
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    console.log("Received userId:", userId);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Valid User ID (integer) is required" }, { status: 400 });
    }

    const parsedUserId = parseInt(userId);
    const query = `
      SELECT event_id, event_date, event_description, event_location, event_name, event_category, status
      FROM events
      WHERE user_id = $1
      ORDER BY event_date ASC
    `;
    console.log("Executing query with userId:", parsedUserId); 
    const result = await pool.query(query, [parsedUserId]);

    console.log("Query result rows:", result.rows); 
    const response = NextResponse.json(result.rows, { status: 200 });
    console.log("Returning response:", result.rows); 
    return response;
  } catch (error) {
    console.error("Error fetching events:", error.stack); 
    return NextResponse.json(
      { error: "Failed to fetch events: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}