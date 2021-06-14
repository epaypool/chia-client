/**
 * This is generated file from config.yaml
 * https://transform.tools/yaml-to-json
 * https://jvilk.com/MakeTypes/
 */

export interface ChiaConfig {
  ALERTS_URL: string;
  CHIA_ALERTS_PUBKEY: string;
  chia_ssl_ca: SslCa;
  daemon_port: number;
  daemon_ssl: SslCerts;
  farmer: Farmer;
  full_node: FullNode;
  harvester: Harvester;
  inbound_rate_limit_percent: number;
  introducer: Introducer;
  logging: Logging;
  min_mainnet_k_size: number;
  network_overrides: NetworkOverrides;
  outbound_rate_limit_percent: number;
  ping_interval: number;
  pool: Pool;
  private_ssl_ca: SslCa;
  selected_network: string;
  self_hostname: string;
  timelord: Timelord;
  timelord_launcher: TimelordLauncher;
  ui: Ui;
  wallet: Wallet;
}
export interface SslCa {
  crt: string;
  key: string;
}
export interface SslCerts {
  private_crt: string;
  private_key: string;
}
export interface Farmer {
  full_node_peer: PeerHost;
  harvester_peer: PeerHost;
  logging: Logging;
  network_overrides: NetworkOverrides;
  pool_public_keys: PoolPublicKeys;
  pool_share_threshold: number;
  port: number;
  rpc_port: number;
  selected_network: string;
  ssl: Ssl;
  start_rpc_server: boolean;
  xch_target_address: string;
}
export interface PeerHost {
  host: string;
  port: number;
}
export interface Logging {
  log_filename: string;
  log_level: string;
  log_maxfilesrotation: number;
  log_stdout: boolean;
}
export interface NetworkOverrides {
  config: Config;
  constants: Constants;
}
export interface Config {
  mainnet: MainnetOrTestnet;
  testnet0: MainnetOrTestnet;
  testnet1: MainnetOrTestnet;
  testnet2: MainnetOrTestnet;
  testnet3: MainnetOrTestnet;
  testnet4: MainnetOrTestnet;
  testnet7: MainnetOrTestnet;
}
export interface MainnetOrTestnet {
  address_prefix: string;
}
export interface Constants {
  mainnet: Mainnet;
  testnet0: Testnet0;
  testnet2: Testnet2;
  testnet3: Testnet3;
  testnet4: Testnet4OrTestnet5OrTestnet7;
  testnet5: Testnet4OrTestnet5OrTestnet7;
  testnet7: Testnet4OrTestnet5OrTestnet7;
}
export interface Mainnet {
  GENESIS_CHALLENGE: string;
  GENESIS_PRE_FARM_FARMER_PUZZLE_HASH: string;
  GENESIS_PRE_FARM_POOL_PUZZLE_HASH: string;
  NETWORK_TYPE: number;
}
export interface Testnet0 {
  GENESIS_CHALLENGE: string;
  GENESIS_PRE_FARM_FARMER_PUZZLE_HASH: string;
  GENESIS_PRE_FARM_POOL_PUZZLE_HASH: string;
  MIN_PLOT_SIZE: number;
  NETWORK_TYPE: number;
}
export interface Testnet2 {
  DIFFICULTY_CONSTANT_FACTOR: number;
  GENESIS_CHALLENGE: string;
  GENESIS_PRE_FARM_FARMER_PUZZLE_HASH: string;
  GENESIS_PRE_FARM_POOL_PUZZLE_HASH: string;
  INITIAL_FREEZE_PERIOD: number;
  MIN_PLOT_SIZE: number;
  NETWORK_TYPE: number;
}
export interface Testnet3 {
  DIFFICULTY_CONSTANT_FACTOR: number;
  GENESIS_CHALLENGE: string;
  GENESIS_PRE_FARM_FARMER_PUZZLE_HASH: string;
  GENESIS_PRE_FARM_POOL_PUZZLE_HASH: string;
  MEMPOOL_BLOCK_BUFFER: number;
  MIN_PLOT_SIZE: number;
  NETWORK_TYPE: number;
}
export interface Testnet4OrTestnet5OrTestnet7 {
  DIFFICULTY_CONSTANT_FACTOR: number;
  DIFFICULTY_STARTING: number;
  EPOCH_BLOCKS: number;
  GENESIS_CHALLENGE: string;
  GENESIS_PRE_FARM_FARMER_PUZZLE_HASH: string;
  GENESIS_PRE_FARM_POOL_PUZZLE_HASH: string;
  INITIAL_FREEZE_END_TIMESTAMP: number;
  MEMPOOL_BLOCK_BUFFER: number;
  MIN_PLOT_SIZE: number;
  NETWORK_TYPE: number;
}
export interface PoolPublicKeys {
  '99656028f4132ae39a7030288c628cfe41707ab66bb87afd7bdc623a295a76a42686da308f67950b8d8af70f723f5b41'?: null;
  a0388c5da5ff4c7ecc6582bcc75950d9179468537a083e6543cca79405b290b70ca9e19b66ce92be672a2bf887f35a55?: null;
  a117f031bd72c34cc87223c7edd7b6000d25a423c551093de7af04c59375ae13a11c4358e448d7e2b29c3a946fbc19bc?: null;
  a490f3c590c320cd9b2507597272492b6b84b3a4409ea80cadac148fe169eff30bb63c34c51b50118d9d36174c4f41ac?: null;
  b241cf324d4eab1e616a2ce5a27b6609736ee5728405f5b982a55ef7b7783fc936fdc598460c7ef675a69f5e7874c312?: null;
  b4754e1177ff7dcc9b214f8f77083384e851b41874700a70db48465622b1d9a0cce5a58aa68f2bc06037453a96ea24d0?: null;
  b8aa69b3536d82803963c6dbf414cb4bdd8d8d28a75b5da29037b0edebeea4e9ef878f144d545299a97b7331ed0391e3?: null;
}
export interface Ssl {
  private_crt: string;
  private_key: string;
  public_crt: string;
  public_key: string;
}
export interface FullNode {
  database_path: string;
  dns_servers?: string[] | null;
  enable_profiler: boolean;
  enable_upnp: boolean;
  exempt_peer_networks?: null[] | null;
  farmer_peer: PeerHost;
  introducer_peer: PeerHost;
  logging: Logging;
  max_inbound_farmer: number;
  max_inbound_timelord: number;
  max_inbound_wallet: number;
  network_overrides: NetworkOverrides;
  peer_connect_interval: number;
  peer_db_path: string;
  port: number;
  recent_peer_threshold: number;
  rpc_port: number;
  sanitize_weight_proof_only: boolean;
  selected_network: string;
  send_uncompact_interval: number;
  short_sync_blocks_behind_threshold: number;
  simulator_database_path: string;
  simulator_peer_db_path: string;
  ssl: Ssl;
  start_rpc_server: boolean;
  sync_blocks_behind_threshold: number;
  target_outbound_peer_count: number;
  target_peer_count: number;
  target_uncompact_proofs: number;
  timelord_peer: PeerHost;
  wallet_peer: PeerHost;
  weight_proof_timeout: number;
}
export interface Harvester {
  chia_ssl_ca: SslCa;
  farmer_peer: PeerHost;
  logging: Logging;
  network_overrides: NetworkOverrides;
  num_threads: number;
  plot_directories?: string[] | null;
  plot_loading_frequency_seconds: number;
  port: number;
  private_ssl_ca: SslCa;
  rpc_port: number;
  selected_network: string;
  ssl: SslCerts;
  start_rpc_server: boolean;
}
export interface Introducer {
  host: string;
  logging: Logging;
  max_peers_to_send: number;
  network_overrides: NetworkOverrides;
  port: number;
  recent_peer_threshold: number;
  selected_network: string;
  ssl: Ssl1;
}
export interface Ssl1 {
  public_crt: string;
  public_key: string;
}
export interface Pool {
  logging: Logging;
  network_overrides: NetworkOverrides;
  selected_network: string;
  xch_target_address: string;
}
export interface Timelord {
  fast_algorithm: boolean;
  full_node_peer: PeerHost;
  logging: Logging;
  max_connection_time: number;
  network_overrides: NetworkOverrides;
  port: number;
  sanitizer_mode: boolean;
  selected_network: string;
  ssl: Ssl;
  vdf_clients: VdfClients;
  vdf_server: PeerHost;
}
export interface VdfClients {
  ip?: string[] | null;
  ips_estimate?: number[] | null;
}
export interface TimelordLauncher {
  logging: Logging;
  port: number;
  process_count: number;
}
export interface Ui {
  daemon_host: string;
  daemon_port: number;
  daemon_ssl: SslCerts;
  logging: Logging;
  network_overrides: NetworkOverrides;
  port: number;
  rpc_port: number;
  selected_network: string;
  ssh_filename: string;
}
export interface Wallet {
  database_path: string;
  full_node_peer: PeerHost;
  initial_num_public_keys: number;
  initial_num_public_keys_new_wallet: number;
  introducer_peer: PeerHost;
  logging: Logging;
  network_overrides: NetworkOverrides;
  num_sync_batches: number;
  peer_connect_interval: number;
  port: number;
  recent_peer_threshold: number;
  rpc_port: number;
  selected_network: string;
  ssl: Ssl;
  start_height_buffer: number;
  starting_height: number;
  target_peer_count: number;
  testing: boolean;
  trusted_peers: TrustedPeers;
  wallet_peers_path: string;
}
export interface TrustedPeers {
  trusted_node_1: string;
}
