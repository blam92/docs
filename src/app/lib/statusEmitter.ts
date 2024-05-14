import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

export const emitStatusChange = (status: any) => {
  eventEmitter.emit('statusChange', status);
};

export const onStatusChange = (callback: (status: any) => void) => {
  eventEmitter.on('statusChange', callback);
};
