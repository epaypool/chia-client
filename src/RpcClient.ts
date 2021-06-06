import { readFileSync } from "fs";
import { Agent } from "https";
import axios from "axios";
import {Connection} from "./ws/Connection";
import {Base} from "./ws/Base";

interface ChiaOptions {
  conn?: Connection;
  origin?: string;
  hostname: string;
  port: number;
  caCertPath: string | boolean;
  certPath: string;
  keyPath: string;
}

class RpcClient extends Base {
  private readonly hostname: string;
  private readonly port: number;
  private readonly agent: Agent;

  public constructor(options: ChiaOptions, origin: string) {
    super(origin, options.conn);
    this.hostname = options.hostname;
    this.port = options.port;
    const cert = readFileSync(options.certPath);
    const key = readFileSync(options.keyPath);
    this.agent = new Agent({
      ...(typeof options.caCertPath !== 'boolean' ? { ca: readFileSync(options.caCertPath) } : {}),
      cert,
      key,
      // rejectUnauthorized: options.hostname !== "localhost",
      rejectUnauthorized: false,
    });
  }

  private baseUri(): string {
    return `https://${this.hostname}:${this.port}`;
  }

  protected async request<T>(
    route: string,
    body: Record<string, string | number | boolean | string[] | undefined>
  ): Promise<T> {
    const { data } = await axios.post<T>(`${this.baseUri()}/${route}`, body, {
      httpsAgent: this.agent,

    });

    return data;
  }
}

export { ChiaOptions, RpcClient };
