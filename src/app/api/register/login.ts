import { NextResponse } from 'next/server';
import db from '../../data/db';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user (explicitly typing the query result)
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    // Ensure rows is an array
    if (rows.length === 0 || rows[0].password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Successful login
    return NextResponse.json({
      message: 'Login successful',
      user: { username: rows[0].username, email: rows[0].email }, // Customize returned user data
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
