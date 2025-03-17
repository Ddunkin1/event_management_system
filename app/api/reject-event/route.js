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
    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }
    const result = await pool.query(
      `
      UPDATE events
      SET status = 'cancelled'
      WHERE event_id = $1 AND status = 'pending'
      RETURNING *
      `,
      [eventId]
    );
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Event not found or already processed" },
        { status: 404 }
      );
    }
    console.log("Event rejected:", result.rows[0]);
    return NextResponse.json({ message: "Event rejected successfully", event: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in reject-event route:", error.stack);
    return NextResponse.json(
      { error: "Failed to reject event: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}