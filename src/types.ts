export interface Participant {
  id: string;
  name: string;
  publicKey: string;
  balance: number;
}

export interface BitcoinInput {
  txid: string;
  vout: number;
  amount: number;
  witnessUtxo: {
    script: string;
    amount: number;
  };
  ownerPubkey: string;
}

export interface BitcoinTransaction {
  txId: string;
  inputs: BitcoinInput[];
  signatures: {
    participantId: string;
    signed: boolean;
    psbt?: string;
  }[];
  status: 'pending_signatures' | 'ready' | 'broadcast' | 'confirmed';
  broadcastTime?: Date;
  serializedPsbt?: string;
}

export interface DLCContract {
  id: string;
  status: 'pending' | 'active' | 'executed' | 'cancelled' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  executedAt?: Date;
  participant1: Participant;
  participant2: Participant;
  oracle: {
    name: string;
    publicKey: string;
  };
  terms: {
    targetPrice: number;
    collateral: number;
    outcome1Payout: number;
    outcome2Payout: number;
    priceThreshold: number;
  };
  currentPrice: number;
  transaction?: BitcoinTransaction;
  winner?: Participant;
  finalPayout?: {
    participant1Amount: number;
    participant2Amount: number;
  };
}