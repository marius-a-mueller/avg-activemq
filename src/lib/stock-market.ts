import { connect, Client } from 'stompit';
import { connectOptions } from './utils';
import { symbols } from './symbols';
import { getLogger, Logger } from './logger';

const course = [421, 176, 881, 170];
let exchangeNum = 0;
let globalClient: Client | undefined = undefined;

export function disconnect() {
  if (globalClient) globalClient.disconnect();
}

// Create a new Stock Market
export async function addMarket() {
  stockMarket(exchangeNum);
  exchangeNum += 1;
}

// The part of a Stock Market that waits for buy-orders
export async function listenM(id: number, log: Logger) {
  log.info(`Listening to queue: /queue/Orders${id}`);
  connect(connectOptions, function (error, client) {
    globalClient = client;
    if (error) {
      log.error(`Error connecting to the broker: ${error.message}`);
      return;
    }
    const subscribeHeaders = {
      destination: `/queue/Orders${id}`,
      ack: 'client-individual',
    };
    try {
      client.subscribe(subscribeHeaders, function (error, message) {
        if (error) {
          log.error(`Couldn't subscribe to the queue: ${error.message}`);
          return;
        }
        message.readString('utf-8', function (error, body) {
          if (error) {
            log.error(`Error while reading the message: ${error.message}`);
            return;
          }
          if (body) {
            const [hid, oid, quantity, sym, price] = body.split(';');
            log.info(
              `Börse(${id}): Order von ${sym} ${quantity}mal ausgeführt von Holder: : ${hid} zum Preis: ${price}`,
            );
            ackStockPurchase(client, Number(hid), Number(oid), log);
          }
        });
      });
    } catch (err) {
      log.info('Error while subscribing');
    }
  });
}

// Acknowledges the Purches of a stock by providing the Order-ID
function ackStockPurchase(
  client: Client,
  holder: number,
  oid: number,
  log: Logger,
) {
  const queueAddress = `/queue/Ack${holder}`;
  const sendHeaders = {
    destination: queueAddress,
    'content-type': 'text/plain',
  };
  log.info(`Acknowledge purchase of stock with Order-ID: ${oid}`);
  const frame = client.send(sendHeaders);
  frame.write(`${oid}`);
  frame.end();
}

// The functionality of an individual Stockmarket
export function stockMarket(id: number) {
  const log = getLogger(`stockmarket ${id}`);
  listenM(id, log);
  log.info('Stock Exchange created with id: ' + id);
  const sendHeaders = {
    destination: '/queue/StockMarketPrices',
    'content-type': 'text/plain',
  };
  let count = 0;
  const messages: string[] = [];
  connect(connectOptions, function (error, client) {
    const intervalId = setInterval(() => {
      log.info('----------------');
      if (count >= 100000) {
        clearInterval(intervalId);
        return;
      }

      if (error) {
        log.info(id + ': connect error ' + error.message);
        return;
      }

      // creating the messages
      //TODO fix
      for (let i = 0; i < 1; i++) {
        course[i] = course[i] * (0.8 + Math.random() * 0.4); //
        messages.push(id + ';' + symbols[i] + ';' + course[i].toFixed(2));
      }
      // sending the messages to the queue
      messages.forEach((message) => {
        log.info(`(sent): ${message}`);
        const frame = client.send(sendHeaders);
        frame.write(message);
        frame.end();
      });
      // CLR messages
      messages.splice(0, messages.length);
      count += 1;
    }, 4000);
  });
}
