import { NextResponse } from "next/server";
import query from "../../lib/db";

export async function GET() {
  try {
    const result = await query("SELECT first_name, email, last_name, role, phone_number FROM users");
    const users = result.rows.map((row) => ({
      id: row.id, 
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      phone_number: row.phone_number,
      role: row.role,

    }));
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error); 
    return NextResponse.json(
      { error: "Failed to fetch users: " + error.message },
      { status: 500 }
    );
  }
}


