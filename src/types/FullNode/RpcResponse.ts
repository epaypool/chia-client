import { RpcResponse } from '../RpcResponse';
import { Connection } from '../Shared/Connection';
import { Block } from './Block';
import { BlockchainState } from './BlockchainState';
import { BlockHeader } from './BlockHeader';
import { BlockRecord } from './BlockRecord';
import { CoinRecord } from './CoinRecord';

export interface BlockchainStateResponse extends RpcResponse {
  blockchain_state: BlockchainState;
}

export interface Constants {
  MIN_PLOT_SIZE: number;
}

export interface NetworkInfoResponse extends RpcResponse {
  network_name: string;
  network_prefix: string;
}

export interface UnfinishedBlockHeadersResponse extends RpcResponse {
  headers: BlockHeader[];
}

export interface HeaderResponse extends RpcResponse {
  header: BlockHeader;
}

export interface BlocksResponse<T extends Block> extends RpcResponse {
  blocks: T[];
}

export interface BlockResponse extends RpcResponse {
  block: Block;
}

export interface BlockRecordResponse extends RpcResponse {
  block_record: BlockRecord;
}

export interface CoinResponse extends RpcResponse {
  coin_records: Array<CoinRecord>;
}

export interface CoinRecordResponse extends RpcResponse {
  coin_record: CoinRecord;
}
export interface AdditionsAndRemovalsResponse extends RpcResponse {
  additions: Array<CoinRecord>;
  removals: Array<CoinRecord>;
}

export interface NetspaceResponse extends RpcResponse {
  space: number;
}

export interface ConnectionResponse extends RpcResponse {
  connections: Array<Connection>;
}
