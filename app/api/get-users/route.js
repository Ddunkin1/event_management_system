import { NextResponse } from 'next/server';
const pool = require('@/config/db');

export async function GET() {
  try {
    const client = await pool.connect();
    const query = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.created_at,
        u.first_name,
        u.last_name,
        u.phone_number,
        COUNT(e.event_id) as events_booked
      FROM users u
      LEFT JOIN events e ON u.id = e.user_id
      GROUP BY 
        u.id,
        u.email,
        u.role,
        u.created_at,
        u.first_name,
        u.last_name,
        u.phone_number
      ORDER BY u.created_at DESC;
    `;

    const result = await client.query(query);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json([]);
    }

    const users = result.rows.map(user => ({
      id: user.id,
      email: user.email,
      first_name: user.first_name || 'N/A',
      last_name: user.last_name || 'N/A',
      phone_number: user.phone_number || 'N/A',
      role: user.role || 'user',
      created_at: user.created_at ? new Date(user.created_at).toISOString() : null,
      events_booked: parseInt(user.events_booked) || 0
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + error.message },
      { status: 500 }
    );
  }
}
