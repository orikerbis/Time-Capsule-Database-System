import { NextResponse } from "next/server";
import db from "../../../data/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, lastName, email, username, password } = body;

    // Validate input
    if (!fullName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the email or username already exists
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if ((rows as any[]).length > 0) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    // Insert the new user into the database without hashing the password
    await db.query(
      "INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES (?, ?, ?, ?, ?)",
      [fullName, lastName, email, username, password]
    );

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
