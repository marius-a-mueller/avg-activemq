import { symbols } from './symbols';

export interface Stock {
  symbol: typeof symbols;
  price: number;
  quantity: number;
}
