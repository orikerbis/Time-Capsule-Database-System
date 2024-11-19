import { NextResponse } from "next/server";
import db from "../../../data/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const { username, capsule_name, release_date, release_time } = Object.fromEntries(formData.entries());

    // Validate input
    if (!username || !capsule_name || !release_date || !release_time) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    if (release_date < today) {
      return NextResponse.json(
        { error: "Release date must be today or in the future" },
        { status: 400 }
      );
    }

    if (release_date === today) {
      const currentTime = new Date().toTimeString().split(' ')[0]; // Get current time in HH:mm:ss format
      if (release_time <= currentTime) {
        return NextResponse.json(
          { error: "Release time must be later than the current time" },
          { status: 400 }
        );
      }
    }

    type UserResult = { user_id: number; };    

    const [userResult] = await db.execute<RowDataPacket[]>(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );
    
    if (userResult.length === 0) {
      throw new Error("User not found");
    }
    
    const user_id = (userResult[0] as UserResult).user_id; 

    const [existingCapsules] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM time_capsules WHERE user_id = ? AND capsule_name = ?`,
      [capsule_name, user_id]
    );

    if (existingCapsules.length > 0) {
      return NextResponse.json(
        { error: "Capsule name already exists for this user." },
        { status: 400 }
      );
    }

    const releaseDateTime = new Date(`${release_date}T${release_time}`);
    const currentTime = new Date();
    const status = releaseDateTime <= currentTime ? "delivered" : "scheduled";

    // Step 1: Create the time capsule
    const capsuleResult = await db.execute(
      `INSERT INTO time_capsules (user_id, capsule_name, release_date, release_time, status)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, capsule_name, release_date, release_time, status]
    );
    
    // Extract the insertId properly
    const capsule_id = (capsuleResult as any).insertId; // or use a type definition for better safety
    

    return NextResponse.json({
      message: "Time Capsule sealed successfully",
      capsule_id: capsule_id,
      capsule_name: capsule_name,
      status: status,
    });
  } catch (error) {
    console.error("Error in /api/time-capsule:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
