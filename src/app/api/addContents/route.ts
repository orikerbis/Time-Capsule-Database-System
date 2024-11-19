import { NextResponse } from "next/server";
import db from "../../../data/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const capsuleName = formData.get("capsule_name") as string;
    const username = formData.get("username") as string;
    const content = formData.get("content"); // Expecting only one file

    // Validate input
    if (!capsuleName || !username || !content) {
      return NextResponse.json(
        { error: "Capsule name, username, and content are required" },
        { status: 400 }
      );
    }

    type UserResult = {
      user_id: number;
    };

    const [userResult] = await db.execute<RowDataPacket[]>(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userResult.length === 0) {
      throw new Error("User  not found");
    }

    const user_id = (userResult[0] as UserResult).user_id;

    const [capsuleResult] = await db.execute<RowDataPacket[]>(
      `SELECT capsule_id FROM time_capsules WHERE capsule_name = ? AND user_id = ?`,
      [capsuleName, user_id]
    );

    if (!capsuleResult || capsuleResult.length === 0) {
      return NextResponse.json(
        { error: "Capsule not found for the given name and user" },
        { status: 404 }
      );
    }

    const capsule_id = capsuleResult[0].capsule_id;

    // Handle image content
    if (content instanceof File) {
      const content_data = Buffer.from(await content.arrayBuffer());
      const content_size = content_data.byteLength;

      if (content_size > 52428800) {
        return NextResponse.json(
          { error: "File size exceeds 50MB limit" },
          { status: 400 }
        );
      }

      // Insert image content into the database
      await db.execute(
        `INSERT INTO capsule_contents (capsule_id, content_type, content_data, content_size)
         VALUES (?, 'image', ?, ?)`, // Hardcoded 'image' as per your requirement
        [capsule_id, content_data, content_size]
      );

      return NextResponse.json({ message: "Image content added successfully", capsule_id });
    }

    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error uploading content:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}