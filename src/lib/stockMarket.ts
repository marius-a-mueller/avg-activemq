//TODO Connection zu stomp schließt nach so 10 Iterationen
// Consume Orders
import { connect } from 'stompit';
import { connectOptions } from './utils';
const course = [421, 176, 881, 170];
    const base = [
        'MSFT;',
        'AAPL;',
        'NVDA;',
        'AMZN;',
    ];
let exchangeNum = 0;

export async function addMarket() {
await stockMarket(exchangeNum);
exchangeNum +=1;
}

export async function stockMarket(id: number) {
  console.log("Stock Exchange created with id: " + id);
    
        const sendHeaders = {
            destination: '/queue/StockMarketPrices',
            'content-type': 'text/plain',
        };
        let count = 0;
        const messages: string[] = [];
        const intervalId = setInterval(() => {
          console.log(count);
            if (count >= 100000) {
                clearInterval(intervalId);
                return;
            }
            connect(connectOptions, async function (error, client) {
              if (error) {
                  console.log(id + ': connect error ' + error.message);
                  return;
              }

            for (let i= 0; i < base.length; i++) {
              course[i] = course[i] * (0.75 + Math.random() * 0.5);
              messages.push(id +";"+ base[i]+ course[i].toFixed(2));
            }
            messages.forEach(message => {
                const frame = client.send(sendHeaders);
                frame.write(message);
                frame.end();
            });
            // CLR
            messages.splice(0, messages.length);
            count += 1;
            client.disconnect();
        })}, 1000);
    
}
