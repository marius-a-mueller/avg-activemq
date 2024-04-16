import { connect } from 'stompit';
import { connectOptions } from './utils';

export async function startStockMarketService() {
  const subscribeHeaders = {
    destination: '/queue/StockMarketPrices',
    'content-type': 'text/plain',
    ack: 'client-individual',
  };

  const sendHeaders = {
    destination: '/topic/StockMarketService',
  };

  connect(connectOptions, async function (error, client) {
    if (error) {
      return console.log('connect error ' + error.message);
    }
    console.log('connected to StockMarketService');

    client.subscribe(subscribeHeaders, function (error, message) {
      if (error) {
        return console.log('subscribe error ' + error.message);
      }

      message.readString('utf-8', function (error, body) {
        if (error) {
          return console.log('read message error ' + error.message);
        }

        if (body) {
          const [_, symbol, price] = body.split(';');
          console.log(
            `StockMarketService (received): Symbol=${symbol} Price=${price}`,
          );

          const frame = client.send(sendHeaders);
          frame.write(body);
          frame.end();
          console.log(`StockMarketService (sent): ${body}`);
        }

        client.ack(message);
      });
    });
  });
}
