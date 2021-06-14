import { randomBytes } from 'crypto';
import { getChiaConfig, getChiaFilePath } from './ChiaNodeUtils';
import { ChiaOptions, RpcClient } from './RpcClient';
import { CertPath } from './types/CertPath';
import { PlotsResponse } from './types/Harvester/RpcResponse';
import { Message, SERVICE } from './ws';

export class WalletUI extends RpcClient {
  public constructor(options?: Partial<ChiaOptions> & CertPath, rootPath?: string) {
    const chiaConfig = getChiaConfig(rootPath);
    const defaultHostname = chiaConfig.self_hostname || 'localhost';
    const defaultPort = chiaConfig.farmer.rpc_port || 8559;
    const defaultCaCertPath = chiaConfig.private_ssl_ca.crt;
    const defaultCertPath = chiaConfig.daemon_ssl.private_crt;
    const defaultCertKey = chiaConfig.daemon_ssl.private_key;

    super(
      {
        conn: options?.conn,
        hostname: options?.hostname || defaultHostname,
        port: options?.port || defaultPort,
        caCertPath: options?.caCertPath || getChiaFilePath(defaultCaCertPath, rootPath),
        certPath: options?.certPath || getChiaFilePath(defaultCertPath, rootPath),
        keyPath: options?.keyPath || getChiaFilePath(defaultCertKey, rootPath),
      },
      options?.origin || randomBytes(32).toString('hex')
    );
  }

  get destination(): string {
    return SERVICE.walletUi;
  }

  public onGetPlots(cb: (data: PlotsResponse) => void): void {
    this.connection?.onMessage((message: Message) => {
      if (message.command !== 'get_plots') {
        return;
      }
      cb(message.data);
    });
  }

  // public async getPlots(): Promise<PlotsResponse> {
  //   return this.request<PlotsResponse>("get_plots", {});
  // }
}
