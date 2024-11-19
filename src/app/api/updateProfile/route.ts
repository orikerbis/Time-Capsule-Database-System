import { NextResponse } from "next/server";
import db from "../../../data/db";
import { RowDataPacket } from "mysql2";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, field, currentValue, newValue } = body;

    // Validate input
    if (!userId || !field || !currentValue || !newValue) {
      return NextResponse.json(
        { error: "All fields (userId, field, currentValue, newValue) are required" },
        { status: 400 }
      );
    }

    // Validate the field being updated
    const validFields = ["username", "email", "password_hash"];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: `Field '${field}' is not valid` },
        { status: 400 }
      );
    }

    const [userRows] = await db.query<RowDataPacket[]>(
        "SELECT user_id, password_hash FROM users WHERE username = ?",
        [userId] // Use the 'userId' which is actually the 'username' in this case
      );
  
      if (userRows.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
  
      const user_id = userRows[0].user_id;
      const storedPassword = userRows[0].password_hash;  

    if (field === "username") {
        const [existingUser] = await db.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE username = ?",
          [newValue]
        );
  
        if (existingUser.length > 0) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 400 }
          );
        }
      }

       // Check for email format and uniqueness
    if (field === "email") {
        if (!emailRegex.test(newValue)) {
          return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 }
          );
        }
  
        const [existingEmail] = await db.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE email = ?",
          [newValue]
        );
  
        if (existingEmail.length > 0) {
          return NextResponse.json(
            { error: "Email is already taken" },
            { status: 400 }
          );
        }
      }

    // Ensure the current value matches the database
    if (field === "password_hash") {
        // Directly compare plain text password
        if (currentValue !== storedPassword) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
      } else {
        // For other fields, directly compare the current value
        const [rows] = await db.query<RowDataPacket[]>(
          `SELECT ${field} FROM users WHERE user_id = ?`,
          [user_id]
        );

    if (rows.length === 0 || rows[0][field] !== currentValue) {
      return NextResponse.json(
        { error: "Current value does not match the database record" },
        { status: 401 }
      );
    }
}

    // Update the field in the database
    await db.query(
      `UPDATE users SET ${field} = ? WHERE user_id = ?`,
      [newValue, user_id]
    );

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
