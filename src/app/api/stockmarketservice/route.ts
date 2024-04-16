import { startStockMarketService } from '@/lib/stock-market-service';

let running = false;

export function GET() {
  if (!running) {
    startStockMarketService();
    running = true;
  }
  return new Response('OK');
}
