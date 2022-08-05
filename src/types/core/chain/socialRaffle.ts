export type SocialRaffleChain = {
  pool: bigint;
  registrar: SocialRaffleRegistrarItem[];
};

export type SocialRaffleRegistrarItem = {
  id: Buffer;
  weight: bigint;
  candidate: Buffer[];
};
