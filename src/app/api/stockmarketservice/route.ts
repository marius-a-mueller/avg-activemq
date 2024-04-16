import { startStockMarketService } from '@/lib/stockMarketService';

export function GET() {
  startStockMarketService();
  return new Response('OK');
}
