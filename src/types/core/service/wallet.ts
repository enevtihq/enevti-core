import { Persona, PersonaService } from '../account/persona';

export type WalletStaked = { persona: Persona; amount: string };

export type WalletView = {
  balance: string;
  staked: string;
  history: TransactionServiceItem[];
};

export type StakeSentService = {
  account: {
    address: string;
    username: string;
    votesUsed: number;
  };
  votes: PersonaService & { amount: string }[];
};

export type TransactionServiceItem = {
  id: string;
  moduleAssetId: string;
  moduleAssetName: string;
  fee: string;
  height: number;
  nonce: string;
  block: {
    id: string;
    height: number;
    timestamp: number;
  };
  sender: PersonaService & {
    publicKey: string;
  };
  signatures: string[];
  asset: Record<string, unknown>;
  isPending: boolean;
};