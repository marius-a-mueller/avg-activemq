import { Client, connect } from 'stompit';
import { connectOptions } from './utils';
import { Stock } from './stock';
import { stockMarket } from './stockMarket';

const stocks: Stock[] = [];

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

          // buy first stock of every symbol
          if (!stocks.find((stock) => stock.symbol === symbol)) {
            buyStock(client, id, Number(stockmarket), symbol, Number(price));
            log(`sent message: ${symbol};${price}`);
          } else if (Math.random() < 0.1) {
            buyStock(client, id, Number(stockmarket), symbol, Number(price));
            log(`sent message: ${symbol};${price}`);
          }

          client.ack(message);
        });
      });
    } catch (e) {
      log('ERROR');
    }
  });
}

function buyStock(
  client: Client,
  id: number,
  stockmarket: number,
  symbol: string,
  price: number,
) {
  const queueAddress = `/queue/Orders${stockmarket}`;
  const sendHeaders = {
    destination: queueAddress,
    'content-type': 'text/plain',
  };

  const frame = client.send(sendHeaders);
  frame.write(`${id};${symbol};${price}`);
  frame.end();

  const ownedStock = stocks.find((stock) => stock.symbol === symbol);
  if (ownedStock) {
    ownedStock.quantity++;
    return;
  }

  const stock: Stock = {
    symbol,
    price,
    quantity: 1,
  };
  stocks.push(stock);
}
