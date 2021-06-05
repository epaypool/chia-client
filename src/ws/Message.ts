import * as WebSocket from "ws";

import { randomBytes } from 'crypto';
import * as JsonBigInt from 'json-bigint';

export interface MessageInfo {
  command: string;
  origin: string;
  destination: string;
  data?: any;
  ack?: boolean;
  requestId?: string;
}

class Message implements MessageInfo {
  readonly command: string;
  readonly origin: string;
  readonly destination: string;
  readonly data?: any;
  readonly ack: boolean;
  readonly requestId: string;

  constructor({
    command,
    origin,
    destination,
    data = {},
    ack = false,
    requestId = randomBytes(32).toString('hex'),
  }: MessageInfo) {
    this.command = command;
    this.data = data;
    this.origin = origin;
    this.destination = destination;
    this.ack = ack;
    this.requestId = requestId;
  }

  toJSON() {
    return JsonBigInt.stringify({
      command: this.command,
      data: this.data,
      origin: this.origin,
      destination: this.destination,
      ack: this.ack,
      request_id: this.requestId,
    });
  }

  static fromJSON(json: WebSocket.Data) {
    const request = JsonBigInt.parse(json as string);

    return new Message({
      command: request.command,
      data: request.data,
      origin: request.origin,
      destination: request.destination,
      ack: request.ack,
      requestId: request.request_id,
    });
  }
}

export { Message };
