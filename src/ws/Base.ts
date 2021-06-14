import { ConnectionResponse } from '../types/FullNode/RpcResponse';
import { Connection } from './Connection';
import { Message } from './Message';

class Base {
  protected connection?: Connection;
  protected readonly origin: string;

  constructor(origin: string, connection?: Connection) {
    this.connection = connection;
    this.origin = origin;
  }

  onConnectionChange(cb: (data: any) => void): void {
    this.connection?.onMessage((message) => {
      if (message.command !== 'get_connections' || message.origin !== this.destination) {
        return;
      }
      cb(message.data.connections);
    });
  }

  onRegisterServiceResult(cb: (data: any) => void): void {
    this.connection?.onMessage((message) => {
      if (message.command !== 'register_service' || message.destination !== this.destination) {
        return;
      }
      cb(message.data);
    });
  }

  async init(): Promise<void> {
    this.connection?.addService(this.origin);
    if (!this.connection?.connected) {
      await this.connection?.connect();
    } else {
      await this.connection.registerServices();
    }
  }

  async ping(): Promise<void> {
    const message = new Message({
      command: 'ping',
      origin: this.origin,
      destination: this.destination,
    });
    await this.connection?.send(message);
  }

  async getConnections(): Promise<ConnectionResponse> {
    const res = await this.connection?.send(
      new Message({
        command: 'get_connections',
        origin: this.origin,
        destination: this.destination,
      })
    );

    return res.data.connections;
  }

  get destination(): string {
    return 'base';
  }
}

export { Base };
