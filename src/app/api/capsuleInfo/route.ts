import { NextRequest, NextResponse } from "next/server";
import db from "../../../data/db"; // Import the db correctly

export async function GET(req: NextRequest) {
  try {
    // Extract capsuleName from the query parameters
    const url = req.nextUrl;
    const capsuleName = url.searchParams.get("capsuleName");

    if (!capsuleName) {
      return NextResponse.json({ message: "Capsule name is required" }, { status: 400 });
    }

    // Fetch time capsule details by capsule name
    const capsuleQuery = `
      SELECT t.capsule_id, t.capsule_name, t.release_date, t.release_time, t.status, u.first_name, u.last_name
      FROM time_capsules t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.capsule_name = ?`;

    // Fetch capsule details using db.query
    const [capsuleDetails]: [any[], any] = await db.query(capsuleQuery, [capsuleName]);

    if (capsuleDetails.length === 0) {
      return NextResponse.json({ message: "Capsule not found" }, { status: 404 });
    }

    const capsule = capsuleDetails[0];

    // Format the release_date using JavaScript Date object
    const formattedReleaseDate = new Date(capsule.release_date).toLocaleDateString(); // Format as 'MM/DD/YYYY'
    const formattedReleaseTime = capsule.release_time; // This is already in HH:mm:ss format, you can keep it as is.

    // Fetch shared users for the capsule
    const sharedUsersQuery = `
      SELECT su.shared_username 
      FROM shared_users su 
      WHERE su.capsule_id = ?`;

    const [sharedUsers]: [any[], any] = await db.query(sharedUsersQuery, [capsule.capsule_id]);

    return NextResponse.json({
      ...capsule,
      release_date: formattedReleaseDate,
      release_time: formattedReleaseTime,
      sharedWith: sharedUsers.map((user: any) => user.shared_username),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching capsule details" }, { status: 500 });
  }
}
