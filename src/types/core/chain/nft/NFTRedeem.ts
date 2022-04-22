import { NFTContentSecure } from './NFTContent';
import { NFTSecret, NFTSecretAsset } from './NFTSecret';

export type NFTRedeem = {
  status: 'ready' | 'pending-secret' | 'limit-exceeded' | '';
  count: number;
  limit: number;
  touched: number;
  secret: NFTSecret;
  content: NFTContentSecure;
  schedule: {
    recurring: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once' | 'instant';
    time: {
      day: number;
      date: number;
      month: number;
      year: number;
    };
    from: {
      hour: number;
      minute: number;
    };
    until: number;
  };
};

export type NFTRedeemAsset = Omit<NFTRedeem, 'secret'> & {
  secret: NFTSecretAsset;
};