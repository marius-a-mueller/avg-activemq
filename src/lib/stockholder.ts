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
          if (body) {
            const [stockmarket, symbol, price] = body.split(';');
            log(`${topicAddress}: received message: ${body}`);
            const queueAddress = `/queue/Orders${stockmarket}`;
            const sendHeaders = {
              destination: queueAddress,
              'content-type': 'text/plain',
            };

            const frame = client.send(sendHeaders);
            frame.write(`${symbol};${price}`);
            frame.end();
            log(`${queueAddress}: sent message: ${symbol};${price}`);
            message.ack();
          }
        });
      });
    } catch (e) {
      log('ERROR');
    }
  });
}
