import { connect, Client } from 'stompit';
import { connectOptions } from './utils';
import { symbols } from './symbols';
import { getLogger, Logger } from './logger';
import { db } from './db';
import { Stock } from '@prisma/client';
const course = [421, 176, 881, 170];
const stockPrices: { [id: number]: number[] } = {};
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
          console.error(`Couldn't subscribe to the queue: ${error.message}`);
          return;
        }
        message.readString('utf-8', function (error, body) {
          if (error) {
            console.error(`Error while reading the message: ${error.message}`);
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
  log.info(`(sent) ack order-ID: ${oid}`);
  const frame = client.send(sendHeaders);
  frame.write(`${oid}`);
  frame.end();
}

// The functionality of an individual Stockmarket
export function stockMarket(id: number) {
  const log = getLogger(`stockmarket ${id}`);
  listenM(id, log);
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
      for (let i = 0; i < course.length; i++) {
        let price: number;
        // Checks if the Market has it's own Stock Prices
        if (!stockPrices[id]) {
          stockPrices[id] = course.slice();
        }
        if (!stockPrices[id][i]) {
          price = course[i] * (0.85 + Math.random() * 0.35);
          stockPrices[id][i] = price;
        } else {
          // Use the existing price for this stock
          price = stockPrices[id][i];
        }
        messages.push(id + ';' + symbols[i] + ';' + price.toFixed(2));
        const stock = {
          symbol: symbols[i],
          price,
          marketId: id,
        };
        createStock({ stock });
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

async function createStock({
  stock,
}: {
  stock: Pick<Stock, 'symbol' | 'price' | 'marketId'>;
}) {
  await db.stock.create({ data: stock });
}
