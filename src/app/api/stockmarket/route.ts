import { addMarket } from '@/lib/stock-market';
let count = 0;
export function GET() {
  addMarket();
  return new Response('OK');
}
