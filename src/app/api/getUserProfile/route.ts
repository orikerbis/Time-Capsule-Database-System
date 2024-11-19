// /api/getUserProfile.ts
import { NextResponse } from "next/server";
import db from "../../../data/db";

// This API route needs to handle getting the logged-in user profile.
export async function GET(req: Request) {
  try {
    // Get username from query params or cookies (depending on how the user is authenticated)
    const url = new URL(req.url);
    const username = url.searchParams.get("username"); // If using query params

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch user data from the database
    const [rows]: [any, any] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // Ensure that 'rows' is an array before accessing its properties
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0]; // Access the first result from the rows

      const maskedPassword = "*****";
      // Send the user profile data back
      return NextResponse.json({
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        password: maskedPassword,
      });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
