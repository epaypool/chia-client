import { Message } from './Message';
import {Connection} from "./Connection";

class Base {
  protected connection?: Connection;
  protected readonly origin: string;

  constructor(origin: string, connection?: Connection ) {
    this.connection = connection;
    this.origin = origin;
  }

  onConnectionChange(cb: (data: any) => void) {
    this.connection?.onMessage(message => {
      if (message.command !== 'get_connections' || message.origin !== this.destination) {
        return;
      }
      cb(message.data.connections);
    });
  }

  onRegisterServiceResult(cb: (data: any) => void) {
    this.connection?.onMessage(message => {
      if (message.command !== 'register_service' || message.destination !== this.destination) {
        return;
      }
      cb(message.data);
    });
  }

  async init() {
    this.connection?.addService(this.origin);
    if (!this.connection?.connected) {
      await this.connection?.connect();
    } else {
      await this.connection.registerServices();
    }
  }

  async ping() {
    const message = new Message({
      command: 'ping',
      origin: this.origin,
      destination: this.destination,
    });
    await this.connection?.send(message);
  }

  async getConnections() {
    const res = await this.connection?.send(new Message({
      command: 'get_connections',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.connections;
  }

  get destination(): string {
    return 'base';
  }
}

export { Base };
