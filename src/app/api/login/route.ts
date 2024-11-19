import { NextResponse } from "next/server";
import db from "../../../data/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user (explicitly typing the query result)
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // Ensure rows is an array and validate password
    if (rows.length === 0 || rows[0].password_hash !== password) {
      console.log("Query result:", rows);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if the username is the admin (hardcoded)
    const user = rows[0];
    const isAdmin = user.username === "admin"; // Assuming admin's username is "admin"

    // Successful login
    return NextResponse.json({
      message: "Login successful",
      user: {
        username: user.username,
        isAdmin: isAdmin, // Add a flag indicating whether the user is an admin
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
