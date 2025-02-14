import * as nock from 'nock';
import { Wallet } from '../';

// jest.mock("fs");
// jest.mock("yaml");

const filePath = '/root/yolo';
describe('Wallet', () => {
  describe('RPC calls', () => {
    const wallet = new Wallet(
      {
        hostname: 'localhost',
        port: 9256,
      },
      './test/'
    );

    const basePath = 'https://localhost:9256';
    const host = 'https://backup.chia.net';
    it('calls log_in with type=start', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/log_in', {
          host: host,
          fingerprint: 123,
          type: 'start',
        })
        .reply(200, 'success');

      expect(await wallet.logIn(123)).toEqual('success');
    });

    it('calls log_in with type=restore_backup', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/log_in', {
          host: host,
          fingerprint: 123,
          type: 'restore_backup',
          file_path: filePath,
        })
        .reply(200, 'success');

      expect(await wallet.logInAndRestore(123, filePath)).toEqual('success');
    });

    it('calls log_in with type=skip', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/log_in', {
          host: host,
          fingerprint: 123,
          type: 'skip',
        })
        .reply(200, 'success');

      expect(await wallet.logInAndSkip(123)).toEqual('success');
    });

    it('calls get_public_keys', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_public_keys')
        .reply(200, { public_key_fingerprints: 'success' });

      expect(await wallet.getPublicKeys()).toEqual('success');
    });

    it('calls get_private_key', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_private_key', { fingerprint: 123 })
        .reply(200, { private_key: 'success' });

      expect(await wallet.getPrivateKey(123)).toEqual('success');
    });

    it('calls generate_mnemonic', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/generate_mnemonic')
        .reply(200, { mnemonic: 'success' });

      expect(await wallet.generateMnemonic()).toEqual('success');
    });

    it('calls add_key', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/add_key', {
          mnemonic: ['bitcoin', 'chia'],
          type: 'new_wallet',
        })
        .reply(200, 'success');

      expect(await wallet.addKey(['bitcoin', 'chia'])).toEqual('success');
    });

    it('calls delete_key', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/delete_key', { fingerprint: 123 })
        .reply(200, 'success');

      expect(await wallet.deleteKey(123)).toEqual('success');
    });

    it('calls delete_all_keys', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/delete_all_keys')
        .reply(200, 'success');

      expect(await wallet.deleteAllKeys()).toEqual('success');
    });

    it('calls get_sync_status', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_sync_status')
        .reply(200, { syncing: 'success' });

      expect(await wallet.getSyncStatus()).toEqual('success');
    });

    it('calls get_height_info', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_height_info')
        .reply(200, { height: 'success' });

      expect(await wallet.getHeightInfo()).toEqual('success');
    });

    it('calls farm_block', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/farm_block', { address: 'fakeAddress' })
        .reply(200, 'success');

      expect(await wallet.farmBlock('fakeAddress')).toEqual('success');
    });

    it('calls get_wallets', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_wallets')
        .reply(200, { wallets: 'success' });

      expect(await wallet.getWallets()).toEqual('success');
    });

    it('calls get_wallet_balance', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_wallet_balance', { wallet_id: 'fakeWalletId' })
        .reply(200, { wallet_balance: 'success' });

      expect(await wallet.getWalletBalance('fakeWalletId')).toEqual('success');
    });

    it('calls get_transaction', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_transaction', {
          wallet_id: 'fakeWalletId',
          transaction_id: 'fakeTransactionId',
        })
        .reply(200, { transaction: 'success' });

      expect(await wallet.getTransaction('fakeWalletId', 'fakeTransactionId')).toEqual('success');
    });

    it('calls get_transactions', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_transactions', { wallet_id: 'fakeWalletId' })
        .reply(200, { transactions: 'success' });

      expect(await wallet.getTransactions('fakeWalletId')).toEqual('success');
    });

    it('calls get_transactions with limit=1000', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_transactions', { wallet_id: 'fakeWalletId', start: 0, end: 1000 })
        .reply(200, { transactions: 'success' });

      expect(await wallet.getTransactions('fakeWalletId', 0, 1000)).toEqual('success');
    });

    it('calls get_next_address', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_next_address', { wallet_id: 'fakeWalletId', new_address: true })
        .reply(200, { address: 'success' });

      expect(await wallet.getNextAddress('fakeWalletId')).toEqual('success');
    });

    it('calls send_transaction', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/send_transaction', {
          wallet_id: 'fakeWalletId',
          amount: 9,
          address: 'fakeAddress',
          fee: 1,
        })
        .reply(200, { transaction: 'success' });

      expect(await wallet.sendTransaction('fakeWalletId', 9, 'fakeAddress', 1)).toEqual('success');
    });

    it('calls create_backup', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/create_backup', { file_path: filePath })
        .reply(200, 'success');

      expect(await wallet.createBackup(filePath)).toEqual('success');
    });
  });
});
