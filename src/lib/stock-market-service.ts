import { Client, connect } from 'stompit';
import { connectOptions } from './utils';
import { getLogger, Logger } from './logger';
import { db } from './db';

let globalClient: Client | undefined = undefined;

export function disconnect() {
  if (globalClient) globalClient.disconnect();
}

const subscribeHeaders = {
  destination: '/queue/StockMarketPrices',
  'content-type': 'text/plain',
  ack: 'client-individual',
};

const sendHeaders = {
  destination: '/topic/StockholderPrices',
  'content-type': 'text/plain',
};

export async function startStockMarketService() {
  const log = getLogger(`stockmarketservice`);

  connect(connectOptions, async function (error, client) {
    globalClient = client;
    if (error) {
      return log.info('connect error ' + error.message);
    }
    log.info('connected to StockMarketService');

    client.subscribe(subscribeHeaders, function (error, message) {
      if (error) {
        return log.info('subscribe error ' + error.message);
      }

      message.readString('utf-8', function (error, body) {
        if (error) {
          return log.info('read message error ' + error.message);
        }

        if (body) {
          listPrice({ client, body, log });
        }

        client.ack(message);
      });
    });
  });
}

async function listPrice({
  client,
  body,
  log,
}: {
  client: Client;
  body: string;
  log: Logger;
}) {
  const [marketId, symbol, price] = body.split(';');

  const frame = client.send(sendHeaders);
  frame.write(body);
  frame.end();
  log.info(`(sent): ${body}`);

  const assignedMarketId = parseInt(marketId) ?? 0;

  await db.price.upsert({
    update: {
      price: parseFloat(price),
    },
    create: {
      marketId: assignedMarketId,
      symbol,
      price: parseFloat(price),
    },
    where: {
      symbol_marketId: {
        marketId: assignedMarketId,
        symbol,
      },
    },
  });
}
