import { NextRequest, NextResponse } from "next/server";
import db from "../../../data/db";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const capsuleName = url.searchParams.get("capsuleName");

    if (!capsuleName) {
      return NextResponse.json({ message: "Capsule name is required" }, { status: 400 });
    }

    // Fetch capsule ID
    const capsuleQuery = `
      SELECT capsule_id
      FROM time_capsules
      WHERE capsule_name = ? AND status = 'delivered'
    `;
    const [capsuleDetails]: [any[], any] = await db.query(capsuleQuery, [capsuleName]);

    if (capsuleDetails.length === 0) {
      return NextResponse.json({ message: "Capsule not found or not delivered" }, { status: 404 });
    }

    const capsuleId = capsuleDetails[0].capsule_id;

    // Fetch capsule contents
    const contentQuery = `
      SELECT content_type, TO_BASE64(content_data) AS content_data
      FROM capsule_contents
      WHERE capsule_id = ?
    `;
    const [contents]: [any[], any] = await db.query(contentQuery, [capsuleId]);

    return NextResponse.json(contents);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching capsule contents" }, { status: 500 });
  }
}
