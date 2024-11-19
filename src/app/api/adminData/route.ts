import { NextResponse } from "next/server";
import db from "../../../data/db"; // Adjust this path to your actual db file

export async function GET() {
  try {
    // Fetch all audit logs (logs from all users)
    const [logRows]: [any[], any] = await db.query(
      `
      SELECT al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp,
             tc.capsule_name,
             GROUP_CONCAT(DISTINCT su.shared_username ORDER BY su.shared_username ASC) AS shared_usernames
      FROM audit_logs al
      LEFT JOIN time_capsules tc ON al.capsule_id = tc.capsule_id
      LEFT JOIN shared_users su ON al.capsule_id = su.capsule_id
      GROUP BY al.log_id, al.user_id, al.action_type, al.capsule_id, al.timestamp, tc.capsule_name
      ORDER BY al.timestamp DESC
      `
    );

    if (logRows.length === 0) {
      return NextResponse.json(
        { error: "No logs found." },
        { status: 404 }
      );
    }

    // Return the logs
    return NextResponse.json(
      { logs: logRows },
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
