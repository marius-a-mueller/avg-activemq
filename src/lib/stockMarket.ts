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

export async function listenM(id: number) {
  console.log(`Listening to queue: /queue/Orders${id}`);

  connect(connectOptions, async function(error, client) {
    if (error) {
      console.error(`Error connecting to the broker: ${error.message}`);
      return;
    }

    const subscribeHeaders = {
      destination: `/queue/Orders${id}`,
      ack: 'client-individual', // TODO needed?
    };

    client.subscribe(subscribeHeaders, function(error, message) {
      if (error) {
        console.error(`Couldn't subscribe to the queue: ${error.message}`);
        return;
      }

      message.readString('utf-8', function(error, body) {
        if (error) {
          console.error(`Error while reading the message: ${error.message}`);
          return;
        }
        console.log(`Order ausgeführt: /queue/Orders${id}: ${body}`);
      });
    });
  });
}

export async function stockMarket(id: number) {
  // listenM(id);
  console.log("Stock Exchange created with id: " + id);
        const sendHeaders = {
            destination:'/queue/StockMarketPrices',
            'content-type': 'text/plain',
        };
        let count = 0;
        const messages: string[] = [];
        connect(connectOptions, function (error, client) {
        const intervalId = setInterval(() => {
          console.log(count);
            if (count >= 100000) {
                clearInterval(intervalId);
                return;
            }
            
              if (error) {
                  console.log(id + ': connect error ' + error.message);
                  return;
              }

            // creating the messages
            for (let i= 0; i < base.length; i++) {
              course[i] = course[i] * (0.8 + Math.random() * 0.2); // 
              messages.push(id +";"+ base[i]+ course[i].toFixed(2));
            }
            // sending the messages to the queue
            messages.forEach(message => {
                const frame = client.send(sendHeaders);
                frame.write(message);
                frame.end();
            });
            // CLR
            messages.splice(0, messages.length);
            count += 1;
            
        }, 500);
        //client.disconnect();
      });
      
}
