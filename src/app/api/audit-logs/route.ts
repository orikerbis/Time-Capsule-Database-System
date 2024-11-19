import { NextResponse } from "next/server";
import db from "../../../data/db"; // Update this path as needed

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    // Fetch the user_id using the username
    const [userRows]: [any[], any] = await db.query(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const user_id = userRows[0].user_id;

    // Fetch the audit logs for the user_id
    const [logRows]: [any[], any] = await db.query(
      `
      SELECT al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp,
             tc.capsule_name,
             GROUP_CONCAT(DISTINCT su.shared_username ORDER BY su.shared_username ASC) AS shared_usernames
      FROM audit_logs al
      LEFT JOIN time_capsules tc ON al.capsule_id = tc.capsule_id
      LEFT JOIN shared_users su ON al.capsule_id = su.capsule_id
      WHERE al.user_id = ?
      GROUP BY al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp, tc.capsule_name
      ORDER BY al.timestamp DESC`, 
      [user_id]
    );

    const [receivedCapsules]: [any[], any] = await db.query(
        `
        SELECT rc.received_id, rc.capsule_id, rc.shared_by_username, rc.received_at, tc.capsule_name
        FROM received_capsules rc
        LEFT JOIN time_capsules tc ON rc.capsule_id = tc.capsule_id
        WHERE rc.receiver_username = ?
        ORDER BY rc.received_at DESC`,
        [username]
      );
  

    if (logRows.length === 0) {
      return NextResponse.json(
        { error: "No logs found for the user." },
        { status: 404 }
      );
    }

    // Return the logs
    return NextResponse.json(
        {
          logs: logRows,
          receivedCapsules,
        },
        { status: 200 }
      );
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
