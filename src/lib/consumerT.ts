//TODO Delete
import { connect } from 'stompit';
import { connectOptions } from './utils';

export async function consume(id: string = '') {
  connect(connectOptions, function (error, client) {
    if (error) {
      console.log(id + ': connect error ' + error.message);
      return;
    }

    const subscribeHeaders = {
      destination: '/queue/StockMarketPrices',
      ack: 'client-individual',
    };

    client.subscribe(subscribeHeaders, function (error, message) {
      if (error) {
        console.log(id + ': subscribe error ' + error.message);
        return;
      }

      message.readString('utf-8', function (error, body) {
        if (error) {
          console.log(id + ': read message error ' + error.message);
          return;
        }
        console.log(id + ': received message: ' + body);
      });
    });
  });
}
