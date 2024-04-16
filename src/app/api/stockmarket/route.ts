import { addMarket } from "@/lib/stockMarket";
import {consume} from "@/lib/consumerT"
let count = 0;
export function GET() {
  addMarket();
  //TODO Rmv
  /*if (count === 0) {
    consume("StMarket Test Consumer:"+ count);
    count+=1;
  }
  **/
  return new Response('OK');
}
