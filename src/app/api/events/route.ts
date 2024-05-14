import { NextRequest, NextResponse } from 'next/server';
import { onStatusChange } from '../../lib/statusEmitter';

export const config = {
  runtime: 'edge',
};

export function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const onStatusChangeCallback = (status: any) => {
        controller.enqueue(`data: ${JSON.stringify(status)}\n\n`);
      };

      onStatusChange(onStatusChangeCallback);

      req.signal.addEventListener('abort', () => {
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    }
  });
}
