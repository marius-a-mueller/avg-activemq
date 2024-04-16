import { connect } from 'stompit';
import { connectOptions } from './utils';

export async function start(id: string = '') {
  function log(text: string) {
    console.log('stckmrktsvc ' + id + ': ' + text);
  }
  function error(text: string) {
    console.error('stckmrktsvc ' + id + ': ' + text);
  }

  connect(connectOptions, function (err, client) {
    if (err) {
      error('connect error ' + err.message);
      return;
    }

    try {
      setInterval(() => {
        const i = 1;
        const address = '/topic/StockholderPrices';
        const sendHeaders = {
          destination: address,
          'content-type': 'text/plain',
        };
        const stockmarket = Math.floor(Math.random() * 10);
        const price = (Math.random() * 100).toFixed(2);
        const frame = client.send(sendHeaders);
        const message = `${stockmarket};AAPL;${price}`;
        frame.write(message);
        frame.end();
        log(`${address}: sent message: ${message}`);
      }, 50);
    } catch (e) {
      error('ERROR');
    }
  });
}
