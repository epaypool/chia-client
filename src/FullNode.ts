import {
  BlocksResponse,
  BlockchainStateResponse,
  CoinResponse,
  CoinRecordResponse,
  NetspaceResponse,
  BlockResponse,
  BlockRecordResponse,
  UnfinishedBlockHeadersResponse,
  AdditionsAndRemovalsResponse, NetworkInfoResponse,
} from "./types/FullNode/RpcResponse";
import { ChiaOptions, RpcClient } from "./RpcClient";
import { Block } from "./types/FullNode/Block";
import { CertPath } from "./types/CertPath";
import { getChiaConfig, getChiaFilePath } from "./ChiaNodeUtils";
// @ts-ignore
import { address_to_puzzle_hash, puzzle_hash_to_address, get_coin_info } from "chia-utils";
import {SERVICE} from "./ws";
import { Message} from "./ws";
import {BlockchainState} from "./types/FullNode/BlockchainState";
import {randomBytes} from "crypto";

class FullNode extends RpcClient {

  public constructor(options?: Partial<ChiaOptions> & CertPath, rootPath?: string) {
    const chiaConfig = getChiaConfig(rootPath);
    const defaultHostname = chiaConfig?.self_hostname || "localhost";
    const defaultPort = chiaConfig?.full_node.rpc_port || 8555;
    const defaultCaCertPath = chiaConfig?.private_ssl_ca.crt;
    const defaultCertPath = chiaConfig?.daemon_ssl.private_crt;
    const defaultCertKey = chiaConfig?.daemon_ssl.private_key;
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
    return SERVICE.fullNode;
  }

  onNewBlockchainState(cb: (data: BlockchainState) => void) {
    this.connection?.onMessage(message => {
      if (message.command !== 'get_blockchain_state') {
        return;
      }
      cb(message.data);
    });
  }

  public async getBlockchainState(): Promise<BlockchainStateResponse> {
    if (this.connection) {
      const messsage = new Message({
        command: 'get_blockchain_state',
        origin: this.origin,
        destination: this.destination
      });
      const res = await this.connection.send(messsage);
      return res.data;
    } else {
      return this.request<BlockchainStateResponse>("get_blockchain_state", {});
    }
  }

  public async getNetworkInfo(): Promise<NetworkInfoResponse> {
    return this.request<NetworkInfoResponse>("get_network_info", {});
  }


  public async getNetworkSpace(
    newerBlockHeaderHash: string,
    olderBlockHeaderHash: string
  ): Promise<NetspaceResponse> {
    return this.request<NetspaceResponse>("get_network_space", {
      newer_block_header_hash: newerBlockHeaderHash,
      older_block_header_hash: olderBlockHeaderHash,
    });
  }

  public async getBlocks<B extends boolean>(
    start: number,
    end: number,
    excludeHeaderHash?: B
  ): Promise<BlocksResponse<Block>> {
    return this.request("get_blocks", {
      start,
      end,
      exclude_header_hash: excludeHeaderHash || false,
    });
  }

  public async getBlock(headerHash: string): Promise<BlockResponse> {
    return this.request<BlockResponse>("get_block", {
      header_hash: headerHash,
    });
  }

  public async getBlockRecordByHeight(
    height: number
  ): Promise<BlockRecordResponse> {
    return this.request<BlockRecordResponse>("get_block_record_by_height", {
      height,
    });
  }

  public async getBlockRecord(hash: string): Promise<BlockRecordResponse> {
    return this.request<BlockRecordResponse>("get_block_record", {
      header_hash: hash,
    });
  }

  public async getUnfinishedBlockHeaders(
    height: number
  ): Promise<UnfinishedBlockHeadersResponse> {
    return this.request<UnfinishedBlockHeadersResponse>(
      "get_unfinished_block_headers",
      {
        height,
      }
    );
  }

  public async getUnspentCoins(
    puzzleHash: string,
    startHeight?: number,
    endHeight?: number
  ): Promise<CoinResponse> {
    return this.request<CoinResponse>("get_coin_records_by_puzzle_hash", {
      puzzle_hash: puzzleHash,
      start_height: startHeight,
      end_height: endHeight,
      include_spent_coins: false,
    });
  }

  public async getCoinRecordByName(name: string): Promise<CoinRecordResponse> {
    return this.request<CoinRecordResponse>("get_coin_record_by_name", {
      name,
    });
  }

  public async getAdditionsAndRemovals(
    hash: string
  ): Promise<AdditionsAndRemovalsResponse> {
    return this.request<AdditionsAndRemovalsResponse>(
      "get_additions_and_removals",
      {
        header_hash: hash,
      }
    );
  }

  /* https://github.com/CMEONE/chia-utils */
  public addressToPuzzleHash(address: string): string {
    return address_to_puzzle_hash(address);
  }

  public puzzleHashToAddress(puzzleHash: string): string {
    return puzzle_hash_to_address(puzzleHash);
  }

  public getCoinInfo(parentCoinInfo: string, puzzleHash: string, amount: number): string {
    return get_coin_info(parentCoinInfo, puzzleHash, amount / 1000000000000);
  }
}

export { FullNode };
