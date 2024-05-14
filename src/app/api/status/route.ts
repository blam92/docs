import { NextRequest, NextResponse } from 'next/server';
import { emitStatusChange } from '../events/route';

let friendsStatus: { [key: string]: 'available' | 'unavailable' } = {};

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  friendsStatus[id] = status;

  emitStatusChange(friendsStatus);
    console.log('POST received', { id, status });
  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function GET() {
    console.log('GET REQUEST', friendsStatus);
  return new NextResponse(JSON.stringify(friendsStatus), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
