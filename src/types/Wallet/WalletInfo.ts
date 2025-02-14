import { Transaction } from './Transaction';
import { WalletType } from './WalletType';

export interface WalletInfo {
  id: number;
  name: string;
  type: WalletType;
  data: unknown;
  balance_total: number;
  balance_pending: number;
  balance_spendable: number;
  balance_frozen: number;
  balance_change: number;
  transactions: Transaction[];
  address: string;
  colour: string;
  sending_transaction: boolean;
  send_transaction_result?: string | null;
}
