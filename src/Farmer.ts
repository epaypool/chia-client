import {
  RewardTargetResponse,
  SignagePointResponse,
  SignagePointsResponse
} from "./types/Farmer/RpcResponse";
import { CertPath } from "./types/CertPath";
import { getChiaConfig, getChiaFilePath } from "./ChiaNodeUtils";
import { ChiaOptions, RpcClient } from "./RpcClient";
import { RpcResponse } from "./types/RpcResponse";
import { FarmingInfo } from "./ws";
import {Message, SERVICE} from "./ws";
import {randomBytes} from "crypto";

class Farmer extends RpcClient {
  public constructor(options?: Partial<ChiaOptions> & CertPath, rootPath?: string) {
    const chiaConfig = getChiaConfig(rootPath);
    const defaultHostname = chiaConfig.self_hostname || "localhost";
    const defaultPort = chiaConfig.farmer.rpc_port || 8559;
    const defaultCaCertPath = chiaConfig.private_ssl_ca.crt;
    const defaultCertPath = chiaConfig.daemon_ssl.private_crt;
    const defaultCertKey = chiaConfig.daemon_ssl.private_key;

    super({
      conn: options?.conn,
      hostname: options?.hostname || defaultHostname,
      port: options?.port || defaultPort,
      caCertPath: options?.caCertPath || getChiaFilePath(defaultCaCertPath, rootPath),
      certPath: options?.certPath || getChiaFilePath(defaultCertPath, rootPath),
      keyPath: options?.keyPath || getChiaFilePath(defaultCertKey, rootPath),
    }, options?.origin || randomBytes(32).toString('hex'));
  }

  get destination() {
    return SERVICE.farmer;
  }

  public onNewFarmingInfo(cb: (data: FarmingInfo) => void) {
    this.connection?.onMessage( (message: Message) => {
      if (message.command !== 'new_farming_info') {
        return;
      }
      cb(message.data.farming_info);
    });
  }

  public async getSignagePoint(
    signagePointHash: string
  ): Promise<SignagePointResponse> {
    if (this.connection) {
      const res = await this.connection.send(new Message({
        command: 'get_signage_point',
        origin: this.origin,
        destination: this.destination,
        data: { sp_hash: signagePointHash }
      }));
      return res.data;
    } else {
      return this.request<SignagePointResponse>("get_signage_point", {
        sp_hash: signagePointHash,
      });
    }
  }

  public async getSignagePoints(): Promise<SignagePointsResponse> {
    if (this.connection) {
      const res = await this.connection.send(new Message({
        command: 'get_signage_points',
        origin: this.origin,
        destination: this.destination,
      }));
      return res.data;
    } else {
      return this.request<SignagePointsResponse>("get_signage_points", {});
    }
  }

  // public async getPoolState(): Promise<any> {
  //   return this.request<any>("get_pool_state", {});
  // }

  public async getRewardTarget(
    searchForPrivateKey: boolean
  ): Promise<RewardTargetResponse> {
    return this.request<RewardTargetResponse>("get_reward_targets", {
      search_for_private_key: searchForPrivateKey,
    });
  }

  public async setRewardTarget(
    farmerTarget?: string,
    poolTarget?: string
  ): Promise<RpcResponse> {
    return this.request<RpcResponse>("set_reward_targets", {
      farmer_target: farmerTarget,
      pool_target: poolTarget
    });
  }
}

export { Farmer };
