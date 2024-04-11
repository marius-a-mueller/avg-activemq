import { test } from '@/lib/broker';

export function GET() {
  test('1');
  test('2');
  test('3');
  test('4');
  test('5');
  test('6');
  test('7');
  return new Response('OK');
}
