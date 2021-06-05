import { Base } from './Base';
import { Message } from './Message';
import { SERVICE } from './Constants';

class Daemon extends Base {
  get destination() {
    return SERVICE.daemon;
  }

  async registerService(serviceName: string) {
    const res = await this.connection?.send(new Message({
      command: 'register_service',
      data: { service: serviceName },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async isServiceRunning(serviceName: string) {
    const res = await this.connection?.send(new Message({
      command: 'is_running',
      data: { service: serviceName },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.is_running;
  }
}

export { Daemon };
