import * as nock from 'nock';
import { SharedCalls } from '../';

// jest.mock("fs");
// jest.mock("yaml");

const basePath = 'https://localhost:8555';
describe('Shared Calls', () => {
  describe('RPC Calls', () => {
    const sharedCallInterface = new SharedCalls(
      {
        hostname: 'localhost',
        port: 8555,
      },
      './test/'
    );

    it('calls get_connections', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/get_connections')
        .reply(200, 'success');

      expect(await sharedCallInterface.getConnections()).toEqual('success');
    });

    it("calls open_connection with url 'node.chia.net'", async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/open_connection', { host: 'node.chia.net', port: 8444 })
        .reply(200, 'success');

      expect(await sharedCallInterface.openConnection('node.chia.net', 8444)).toEqual('success');
    });

    it('calls stop_node', async () => {
      nock(basePath)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/stop_node', {})
        .reply(200, 'success');

      expect(await sharedCallInterface.stopNode()).toEqual('success');
    });
  });
});
