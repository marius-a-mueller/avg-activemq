import { Client, connect } from 'stompit';
import { connectOptions } from './utils';
import { getLogger } from './logger';

let globalClient: Client | undefined = undefined;

export function disconnect() {
  if (globalClient) globalClient.disconnect();
}

export async function startStockMarketService() {
  const log = getLogger(`stockmarketservice`);
  const subscribeHeaders = {
    destination: '/queue/StockMarketPrices',
    'content-type': 'text/plain',
    ack: 'client-individual',
  };

  const sendHeaders = {
    destination: '/topic/StockholderPrices',
    'content-type': 'text/plain',
  };

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
          const frame = client.send(sendHeaders);
          frame.write(body);
          frame.end();
          log.info(`(sent): ${body}`);
        }

        client.ack(message);
      });
    });
  });
}
