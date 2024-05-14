import { NextRequest, NextResponse } from 'next/server';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

export function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const onStatusChange = (status: any) => {
        console.log('on sstatus change', status);
        controller.enqueue(`data: ${JSON.stringify(status)}\n\n`);
      };

      eventEmitter.on('statusChange', onStatusChange);

      req.signal.addEventListener('abort', () => {
        console.log('aborted');
        eventEmitter.removeListener('statusChange', onStatusChange);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

export function emitStatusChange(status: any) {
  eventEmitter.emit('statusChange', status);
}
