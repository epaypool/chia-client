import { readFileSync } from "fs";
import { Agent } from "https";
import axios from "axios";
import {Connection} from "./ws/Connection";

interface ChiaOptions {
  hostname: string;
  port: number;
  caCertPath: string | boolean;
  certPath: string;
  keyPath: string;
}

class RpcClient {
  private readonly hostname: string;
  private readonly port: number;
  private readonly agent: Agent;
  protected readonly ws: Connection;

  public constructor(options: ChiaOptions) {
    this.hostname = options.hostname;
    this.port = options.port;
    const cert = readFileSync(options.certPath);
    const key = readFileSync(options.keyPath);
    this.agent = new Agent({
      ...(typeof options.caCertPath !== 'boolean' ? { ca: readFileSync(options.caCertPath) } : {}),
      cert,
      key,
      rejectUnauthorized: options.hostname !== "localhost",
    });
    this.ws = new Connection(options.hostname, { cert, key })
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
