import { symbols } from './symbols';

export interface Order {
  symbol: (typeof symbols)[number];
  quantity: number;
  price: number;
  date: Date;
  ack: boolean;
}
