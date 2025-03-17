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

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { event_name, event_date, event_description, event_location, event_category, user_id } = body;

    if (!event_name || !event_date || !event_description || !event_location || !event_category || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields: event_name, event_date, event_description, event_location, event_category, user_id" },
        { status: 400 }
      );
    }

    if (isNaN(user_id)) {
      return NextResponse.json({ error: "User ID must be a valid integer" }, { status: 400 });
    }

    const validCategories = ["Business Events", "Social Events", "Personal Events", "Academic Events"];
    if (!validCategories.includes(event_category)) {
      return NextResponse.json(
        { error: "Invalid event category. Must be one of: Business Events, Social Events, Personal Events, Academic Events" },
        { status: 400 }
      );
    }

    const values = [
      event_name,
      event_date,
      event_description,
      event_location,
      event_category,
      parseInt(user_id),
      "pending",
    ];
    const query = `
      INSERT INTO events (event_name, event_date, event_description, event_location, event_category, user_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const result = await pool.query(query, values);

    console.log("Database query result:", result.rows[0]); 

    const response = NextResponse.json(result.rows[0], { status: 201 });
    console.log("Returning response:", result.rows[0]); 
    return response;
  } catch (error) {
    console.error("Error in create-event route:", error.stack);
    return NextResponse.json(
      { error: "Failed to create event: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}