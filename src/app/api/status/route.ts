import { NextRequest, NextResponse } from 'next/server';
import { emitStatusChange } from '../../lib/statusEmitter';

let friendsStatus: { [key: string]: 'available' | 'unavailable' } = {};

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  friendsStatus[id] = status;

  emitStatusChange(friendsStatus);

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function GET() {
  return new NextResponse(JSON.stringify(friendsStatus), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
