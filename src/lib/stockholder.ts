import { connect } from 'stompit';
import { connectOptions } from './utils';

export async function start(id: number) {
  function log(text: string) {
    console.log('stockholder ' + id + ': ' + text);
  }
  function error(text: string) {
    console.error('stockholder ' + id + ': ' + text);
  }

  connect(connectOptions, function (err, client) {
    if (err) {
      error('connect error ' + err.message);
      return;
    }

    const subscribeHeaders = {
      destination: '/topic/StockholderPrices',
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
          if (body) {
            const [stockmarket, symbol, price] = body.split(';');
            log('received message: ' + body);
            const sendHeaders = {
              destination: `/queue/Orders${stockmarket}`,
              'content-type': 'text/plain',
            };

            const frame = client.send(sendHeaders);
            frame.write(`${symbol};${price}`);
            frame.end();
            log(`sent message: ${symbol};${price}`);
            //client.ack(message);
          }
        });
      });
    } catch (e) {
      log('ERROR');
    }
  });
}
