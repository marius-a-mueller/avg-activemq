import { Client, connect } from 'stompit';
import { connectOptions } from './utils';
import { Purchase } from './purchase';

const purchases: Purchase[] = [];

export async function start(id: number) {
  function log(text: string) {
    console.log('stockholder ' + id + ': ' + text);
  }
  function error(text: string) {
    console.error('stockholder ' + id + ': ' + text);
  }

  connect(connectOptions, function (err, client) {
    log('start');
    if (err) {
      error('connect error ' + err.message);
      return;
    }

    const topicAddress = '/topic/StockholderPrices';

    const subscribeHeaders = {
      destination: topicAddress,
      ack: 'client-individual',
    };

    try {
      client.subscribe(subscribeHeaders, function (err, message) {
        if (err) {
          log('subscribe error ' + err.message);
          return;
        }
        message.readString('utf-8', function (err, body) {
          if (err) {
            error('read message error ' + err.message);
            return;
          }
          if (!body) return;
          log(`${topicAddress}: received message: ${body}`);
          const [stockmarket, symbol, price] = body.split(';');
          const quantity = Math.floor(Math.random() * 10) + 1;
          // buy first stock of every symbol
          if (!purchases.find((purchase) => purchase.symbol === symbol)) {
            buyStock(
              client,
              id,
              quantity,
              Number(stockmarket),
              symbol,
              Number(price),
            );
            log(`sent message: ${symbol};${price}`);
          } else if (Math.random() < 0.1) {
            buyStock(
              client,
              id,
              quantity,
              Number(stockmarket),
              symbol,
              Number(price),
            );
            log(`sent message: ${symbol};${price}`);
          }

          client.ack(message);
        });
      });
    } catch (e) {
      log('Stockholder error while subscribing');
    }
  });
}

function buyStock(
  client: Client,
  id: number,
  stockmarket: number,
  quantity: number,
  symbol: string,
  price: number,
) {
  const queueAddress = `/queue/Orders${stockmarket}`;
  const sendHeaders = {
    destination: queueAddress,
    'content-type': 'text/plain',
  };

  const frame = client.send(sendHeaders);
  frame.write(`${id};${quantity};${symbol};${price}`);
  frame.end();

  const purchase: Purchase = {
    symbol,
    price,
    quantity: 1,
    date: new Date(),
    ack: false,
  };
  purchases.push(purchase);
}
