import { getChiaConfig, getChiaFilePath } from './ChiaNodeUtils';
import { ChiaOptions, RpcClient } from './RpcClient';
import { CertPath } from './types/CertPath';
import { ConnectionResponse } from './types/FullNode/RpcResponse';
import { RpcResponse } from './types/RpcResponse';

class SharedCalls extends RpcClient {
  public constructor(options?: Partial<ChiaOptions> & CertPath, rootPath?: string) {
    const chiaConfig = getChiaConfig(rootPath);
    const defaultHostname = chiaConfig?.self_hostname || 'localhost';
    const defaultPort = chiaConfig?.full_node.rpc_port || 8555;
    const defaultCaCertPath = chiaConfig?.private_ssl_ca.crt;
    const defaultCertPath = chiaConfig?.daemon_ssl.private_crt;
    const defaultCertKey = chiaConfig?.daemon_ssl.private_key;
    super(
      {
        conn: options?.conn,
        hostname: options?.hostname || defaultHostname,
        port: options?.port || defaultPort,
        caCertPath: options?.caCertPath || getChiaFilePath(defaultCaCertPath, rootPath),
        certPath: options?.certPath || getChiaFilePath(defaultCertPath, rootPath),
        keyPath: options?.keyPath || getChiaFilePath(defaultCertKey, rootPath),
      },
      'shared_calls'
    );
  }

  public async getConnections(): Promise<ConnectionResponse> {
    return this.request<ConnectionResponse>('get_connections', {});
  }

  public async openConnection(host: string, port: number): Promise<RpcResponse> {
    return this.request<RpcResponse>('open_connection', {
      host: host,
      port: port,
    });
  }

  public async closeConnection(nodeId: string): Promise<RpcResponse> {
    return this.request<RpcResponse>('close_connection', {
      node_id: nodeId,
    });
  }

  public async stopNode(): Promise<RpcResponse> {
    return this.request<RpcResponse>('stop_node', {});
  }
}

export { SharedCalls };
