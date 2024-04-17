import { db } from '@/lib/db';

export async function GET() {
  await db.order.deleteMany();

  return new Response('OK');
}
