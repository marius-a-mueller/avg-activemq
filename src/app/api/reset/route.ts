import { db } from '@/lib/db';
import { disconnect as stockholderDisconnect } from '@/lib/stockholder';
import { disconnect as stockMarketDisconnect } from '@/lib/stock-market';
import { disconnect as stockMarketServiceDisconnect } from '@/lib/stock-market-service';

export async function GET() {
  await Promise.all([
    db.order.deleteMany(),
    db.log.deleteMany(),
    db.stock.deleteMany(),
  ]);

  stockholderDisconnect();
  stockMarketDisconnect();
  stockMarketServiceDisconnect();

  return new Response('OK');
}
