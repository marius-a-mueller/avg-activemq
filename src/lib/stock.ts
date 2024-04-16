import { symbols } from './symbols';

export interface Stock {
  symbol: (typeof symbols)[number];
  price: number;
  quantity: number;
}
