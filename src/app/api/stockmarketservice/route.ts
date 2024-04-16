import { startStockMarketService } from '@/lib/stockMarketService';

export function GET() {
  getStockMarketService();
  return new Response('OK');
}
