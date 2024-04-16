import { startStockMarketService } from '@/lib/stock-market-service';

export function GET() {
  startStockMarketService();
  return new Response('OK');
}
