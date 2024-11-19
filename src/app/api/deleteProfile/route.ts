import { NextResponse } from "next/server";
import db from "../../../data/db";
import { OkPacket } from "mysql2"; // Import the correct type from mysql2

export async function DELETE(req: Request) {
  try {
    const username = req.headers.get("user-id"); // Replace with session/auth logic

    // Ensure userId is provided
    if (!username) {
      return NextResponse.json(
        { error: "Username is required to delete the profile" },
        { status: 400 }
      );
    }

    // Delete the user from the database
    const [result] = await db.query<OkPacket>("DELETE FROM users WHERE username = ?", [username]);

    // OkPacket contains the affectedRows property
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
