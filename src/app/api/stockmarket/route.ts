import { addMarket } from "@/lib/stockMarket";
let count = 0;
export function GET() {
  addMarket();
  return new Response('OK');
}
