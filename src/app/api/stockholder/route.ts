import { start } from '@/lib/stockholder';

let count = 0;

export function GET() {
  start(`${count}`);
  count++;
  return new Response('OK');
}
