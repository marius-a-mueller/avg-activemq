import { Client, connect } from 'stompit';
import { connectOptions } from './utils';
import { symbols } from './symbols';

export interface Order {
  symbol: (typeof symbols)[number];
  quantity: number;
  price: number;
  date: Date;
  ack: boolean;
  id: number;
}

const orders: Order[] = [];
let orderId = 0;

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
        if (!orders.find((order) => order.symbol === symbol)) {
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

    const ackSubscribeHeaders = {
      destination: `/queue/Ack${id}`,
      ack: 'client-individual',
    };

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
        log(`/queue/Ack${id}: received message: ${body}`);
        const order = orders.find((order) => order.id === Number(body));
        if (order) {
          order.ack = true;
          log(`acknowledged order: ${body}`);
        }

        client.ack(message);
      });
    });
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
  frame.write(`${id};${orderId};${quantity};${symbol};${price}`);
  frame.end();

  const order: Order = {
    symbol,
    price,
    quantity: 1,
    date: new Date(),
    ack: false,
    id: orderId,
  };
  orders.push(order);
  orderId++;
}
