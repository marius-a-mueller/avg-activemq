import { symbols } from './symbols';

export interface Purchase {
  symbol: (typeof symbols)[number];
  quantity: number;
  price: number;
  date: Date;
}
