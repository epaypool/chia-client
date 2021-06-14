import { Base } from './Base';
import { SERVICE } from './Constants';
import { Message } from './Message';

class Daemon extends Base {
  get destination(): string {
    return SERVICE.daemon;
  }

  async registerService(serviceName: string): Promise<any> {
    const res = await this.connection?.send(
      new Message({
        command: 'register_service',
        data: { service: serviceName },
        origin: this.origin,
        destination: this.destination,
      })
    );

    return res.data;
  }

  async isServiceRunning(serviceName: string): Promise<boolean> {
    const res = await this.connection?.send(
      new Message({
        command: 'is_running',
        data: { service: serviceName },
        origin: this.origin,
        destination: this.destination,
      })
    );

    return res.data.is_running;
  }
}

export { Daemon };
