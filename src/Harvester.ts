import { randomBytes } from 'crypto';
import { getChiaConfig, getChiaFilePath } from './ChiaNodeUtils';
import { ChiaOptions, RpcClient } from './RpcClient';
import { CertPath } from './types/CertPath';
import { PlotDirectoriesResponse, PlotsResponse } from './types/Harvester/RpcResponse';
import { RpcResponse } from './types/RpcResponse';
import { Message, SERVICE } from './ws';

class Harvester extends RpcClient {
  public constructor(options?: Partial<ChiaOptions> & CertPath, rootPath?: string) {
    const chiaConfig = getChiaConfig(rootPath);
    const defaultHostname = chiaConfig?.self_hostname || 'localhost';
    const defaultPort = chiaConfig?.harvester.rpc_port || 8560;
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
      options?.origin || randomBytes(32).toString('hex')
    );
  }

  get destination(): string {
    return SERVICE.harvester;
  }

  public async getPlots(): Promise<PlotsResponse> {
    if (this.connection) {
      const res = await this.connection.send(
        new Message({
          command: 'get_plots',
          origin: this.origin,
          destination: this.destination,
        })
      );
      return res.data;
    } else {
      return this.request<PlotsResponse>('get_plots', {});
    }
  }

  public async refreshPlots(): Promise<RpcResponse> {
    return this.request<RpcResponse>('refresh_plots', {});
  }

  public async deletePlot(fileName: string): Promise<RpcResponse> {
    return this.request<RpcResponse>('delete_plot', {
      filename: fileName,
    });
  }

  public async addPlotDirectory(dirName: string): Promise<RpcResponse> {
    return this.request<RpcResponse>('add_plot_directory', {
      dirname: dirName,
    });
  }

  public async getPlotDirectories(): Promise<PlotDirectoriesResponse> {
    return this.request<PlotDirectoriesResponse>('get_plot_directories', {});
  }

  public async removePlotDirectory(dirName: string): Promise<RpcResponse> {
    return this.request<RpcResponse>('remove_plot_directory', {
      dirname: dirName,
    });
  }
}

export { Harvester };
