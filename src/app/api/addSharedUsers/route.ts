import { NextResponse } from "next/server";
import db from "../../../data/db"; // Assuming db is your database connection

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shared_users, capsule_id } = body;

    // Validate the input data
    if (!Array.isArray(shared_users) || shared_users.length === 0) {
      return NextResponse.json(
        { error: "Shared users data is invalid" },
        { status: 400 }
      );
    }

    if (!capsule_id) {
      return NextResponse.json(
        { error: "Capsule ID is required" },
        { status: 400 }
      );
    }

    // Create a values array for the bulk insert
    const values: any[] = [];
    shared_users.forEach((user: any) => {
      values.push([capsule_id, user.username]);
    });

    // Correct the query to use VALUES() for insertion
    const query = `
      INSERT INTO shared_users (capsule_id, shared_username)
      SELECT ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM shared_users
        WHERE capsule_id = ? AND shared_username = ?
      )
      AND EXISTS (
        SELECT 1 FROM users
        WHERE username = ?
      )
    `;

    // Execute the queries with the correct parameter passing
    const queries = values.map((value) =>
      db.execute(query, [...value, value[0], value[1], value[1]])
    );

    await Promise.all(queries);

    return NextResponse.json({ message: "Shared users added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/addSharedUsers:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
