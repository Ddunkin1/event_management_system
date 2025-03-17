import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

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

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { first_name, last_name, email, password, phone_number } = body;

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: first_name, last_name, email, password" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    let formattedPhoneNumber = phone_number;
    const internationalPhoneRegex = /^\+639\d{9}$/; 
    const localPhoneRegex = /^09\d{9}$/; 

    if (formattedPhoneNumber) {
      if (localPhoneRegex.test(formattedPhoneNumber)) {
        formattedPhoneNumber = `+63${formattedPhoneNumber.slice(1)}`;
      }

      if (!internationalPhoneRegex.test(formattedPhoneNumber)) {
        return NextResponse.json(
          { error: "Invalid phone number format (must be +639 followed by 9 digits or 09 followed by 10 digits, e.g., +639123456789 or 09123456789)" },
          { status: 400 }
        );
      }
    }

    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (first_name, last_name, email, password, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, phone_number";
    const values = [first_name, last_name, email, hashedPassword, formattedPhoneNumber || null];
    const result = await pool.query(query, values);

    console.log("Database query result:", result.rows[0]);
    const response = NextResponse.json(
      { message: "User registered successfully", user: result.rows[0] },
      { status: 201 }
    );
    console.log("Returning response:", result.rows[0]);
    return response;
  } catch (error) {
    console.error("Error in register route:", error.stack);
    return NextResponse.json(
      { error: "Failed to register user: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}