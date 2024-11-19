import { NextResponse } from "next/server";
import db from "../../../data/db"; // Update this path as needed

export async function GET(req: Request) {
  try {
    // Parse the query parameters
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    console.log("Fetching time capsules for username:", username);

    // Fetch the created capsules
    const [createdCapsules]: [any[], any] = await db.query(
      `
      SELECT tc.capsule_id, tc.capsule_name, tc.status
      FROM users u
      INNER JOIN time_capsules tc ON u.user_id = tc.user_id
      WHERE u.username = ?`,
      [username]
    );

    // Fetch the received capsules (excluding those already created by the user)
    const [receivedCapsules]: [any[], any] = await db.query(
      `
      SELECT tc.capsule_id, tc.capsule_name, tc.status
      FROM received_capsules rc
      INNER JOIN time_capsules tc ON rc.capsule_id = tc.capsule_id
      WHERE rc.receiver_username = ?`,
      [username]
    );

    // Update the status of received capsules to 'received' while preserving other details
    const updatedReceivedCapsules = receivedCapsules.map(capsule => ({
      ...capsule,
      status: 'received' // Explicitly set status as 'received' for received capsules
    }));

    // Now combine the created capsules and updated received capsules
    // Ensure no duplicates and keep the status of created capsules intact
    const allCapsules = [
      ...createdCapsules,
      ...updatedReceivedCapsules.filter(receivedCapsule => 
        !createdCapsules.some(createdCapsule => createdCapsule.capsule_id === receivedCapsule.capsule_id)
      )
    ];

    // Fetch the total count of unique capsules (both created and received)
    const [totalCountResult]: [any[], any] = await db.query(
      `
      SELECT COUNT(DISTINCT capsule_id) AS totalCount
      FROM (
        SELECT tc.capsule_id
        FROM users u
        INNER JOIN time_capsules tc ON u.user_id = tc.user_id
        WHERE u.username = ?
        UNION ALL
        SELECT tc.capsule_id
        FROM received_capsules rc
        INNER JOIN time_capsules tc ON rc.capsule_id = tc.capsule_id
        WHERE rc.receiver_username = ?
      ) AS combined_capsules`,
      [username, username]
    );

    const totalCount = totalCountResult[0]?.totalCount || 0;

    if (allCapsules.length === 0) {
      return NextResponse.json(
        { error: "No time capsules found for the user." },
        { status: 404 }
      );
    }

    // Return both created and received capsules and the count
    return NextResponse.json({ capsules: allCapsules, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching time capsules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
