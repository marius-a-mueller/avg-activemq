import { start } from '@/lib/stockmarketservice-dummy';

let i = 0;

export function GET() {
  start(`${i}`);
  i++;
  return new Response('OK');
}
