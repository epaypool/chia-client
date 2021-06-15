import Debug from 'debug';
import * as events from 'events';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Daemon } from './Daemon';
import { Message } from './Message';
// const { Daemon } = require('./api-client');
const debug = Debug('epaypool:Connection.ts');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class Connection {
  private readonly address: string;
  private ws!: WebSocket;
  public connected: boolean;
  private events: events.EventEmitter;
  private callbackMap: Map<string, any>;
  private services: Map<any, any>;
  private registeredServices: Map<any, any>;
  private shouldRconnect: boolean;
  private timeoutInSeconds: number;
  private options: WebSocket.ClientOptions | http.ClientRequestArgs | undefined;

  constructor(address: string, options?: WebSocket.ClientOptions | http.ClientRequestArgs, timeoutInSeconds = 30) {
    this.address = address;
    this.options = options;
    this.connected = false;
    this.events = new events.EventEmitter();
    this.callbackMap = new Map();
    this.services = new Map();
    this.registeredServices = new Map();
    this.shouldRconnect = true;
    this.timeoutInSeconds = timeoutInSeconds;
  }

  addService(serviceName: string): void {
    this.services.set(serviceName, serviceName);
  }

  async connect(): Promise<void> {
    const link = `wss://${this.address}`;
    debug('Connecting to %s', link);
    this.ws = new WebSocket(link, this.options);
    this.connected = false;

    const isOpen = new Promise((resolve, reject) => {
      let resolved = false;
      this.ws?.once('open', () => {
        if (resolved) {
          return;
        }
        resolved = true;
        resolve(true);
      });
      this.ws.once('error', (err) => {
        if (resolved) {
          return;
        }
        resolved = true;
        reject(err);
      });
    });

    this.ws.on('open', this.onOpen.bind(this));
    this.ws.on('close', this.onClose.bind(this));
    this.ws.on('error', this.events.emit);
    this.ws.on('message', (data) => {
      const message = Message.fromJSON(data);
      if (this.callbackMap.has(message.requestId)) {
        if (message.command === 'register_service') {
          this.events.emit('message', message);
        }
        const { resolve, reject } = this.callbackMap.get(message.requestId);
        this.callbackMap.delete(message.requestId);
        if (message.data.error) {
          return reject(new Error(message.data.error));
        }
        if (!message.data.success) {
          return reject(new Error(`Request failed: ${JSON.stringify(message.data)}`));
        }
        resolve(message);
      } else {
        this.events.emit('message', message);
      }
    });

    await isOpen;
    await this.registerServices();
  }

  onOpen(): void {
    debug('connected ', `wss://${this.address}`);
    this.connected = true;
  }

  async onClose(): Promise<void> {
    this.connected = false;
    this.registeredServices.clear();
    if (!this.shouldRconnect) {
      return;
    }
    await sleep(this.timeoutInSeconds * 1000);
    try {
      await this.connect();
    } catch (err) {
      this.events.emit('error', err);
    }
  }

  onMessage(cb: (...args: any[]) => void): void {
    this.events.on('message', cb);
  }

  onError(cb: (...args: any[]) => void): void {
    this.events.on('error', cb);
  }

  async send(message: Message): Promise<any> {
    if (!this.connected) {
      throw new Error('Can not send while not connected');
    }

    return new Promise((resolve, reject) => {
      this.callbackMap.set(message.requestId, { resolve, reject });
      this.ws.send(message.toJSON());
      setTimeout(() => {
        if (!this.callbackMap.has(message.requestId)) {
          return;
        }
        this.callbackMap.delete(message.requestId);
        reject(new Error(`Timeout of ${this.timeoutInSeconds} seconds reached`));
      }, this.timeoutInSeconds * 1000);
    });
  }

  async registerServices(): Promise<void> {
    if (!this.connected) {
      throw new Error('Can not register services while not connected');
    }
    const unregisteredServices = Array.from(this.services.values()).filter(
      (serviceName) => !this.registeredServices.has(serviceName)
    );
    for (const service of unregisteredServices) {
      const daemon = new Daemon(service, this);
      await daemon.registerService(service);
      this.registeredServices.set(service, service);
    }
  }

  async close(): Promise<void> {
    if (!this.connected) {
      return;
    }
    this.shouldRconnect = false;
    this.ws.close();
    while (this.connected) {
      await sleep(100);
    }
    this.shouldRconnect = true;
  }
}

export { Connection };
