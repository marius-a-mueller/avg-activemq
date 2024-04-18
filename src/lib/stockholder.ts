import { Client, connect } from 'stompit';
import { connectOptions } from './utils';
import { db } from './db';
import { getLogger } from './logger';

let orderId = 0;
let globalClient: Client | undefined = undefined;

export function disconnect() {
  if (globalClient) globalClient.disconnect();
}

export async function start(id: number) {
  const log = getLogger(`stockholder ${id}`);

  connect(connectOptions, function (err, client) {
    globalClient = client;
    log.info('start');
    if (err) {
      log.error('connect error ' + err.message);
      return;
    }

    const topicAddress = '/topic/StockholderPrices';

    const subscribeHeaders = {
      destination: topicAddress,
      ack: 'client-individual',
    };

    client.subscribe(subscribeHeaders, function (err, message) {
      if (err) {
        log.info('subscribe error ' + err.message);
        return;
      }
      message.readString('utf-8', function (err, body) {
        if (err) {
          log.error('read message error ' + err.message);
          return;
        }
        if (!body) return;
        log.info(`(received) ${body}`);
        const [stockmarket, symbol, price] = body.split(';');
        const quantity = Math.floor(Math.random() * 10) + 1;
        // buy first stock of every symbol
        if (Math.random() < 0.1) {
          buyStock(
            client,
            id,
            Number(stockmarket),
            quantity,
            symbol,
            Number(price),
          );
          log.info(`${stockmarket} (sent) ${symbol};${price}`);
        }

        client.ack(message);
      });
    });

    const ackSubscribeHeaders = {
      destination: `/queue/Ack${id}`,
      ack: 'client-individual',
    };

    client.subscribe(ackSubscribeHeaders, function (err, message) {
      if (err) {
        log.info('subscribe error ' + err.message);
        return;
      }
      message.readString('utf-8', async function (err, body) {
        if (err) {
          log.error('read message error ' + err.message);
          return;
        }
        if (!body) return;
        log.info(`/queue/Ack${id}: (received): ${body}`);

        await db.order.updateMany({
          data: { ack: true },
          where: { stockholderId: id },
        });

        client.ack(message);
      });
    });
  });
}

async function buyStock(
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

  console.error(
    `${queueAddress} (sent) ${id};${orderId};${quantity};${symbol};${price}`,
  );

  const order = {
    symbol,
    price,
    quantity: 1,
    stockholderId: id,
    orderId,
  };

  await db.order.create({
    data: order,
  });

  orderId++;
}
