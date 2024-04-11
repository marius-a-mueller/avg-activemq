import { connect } from 'stompit';
import { connectOptions } from './utils';

export async function test(id: string = '') {
  connect(connectOptions, function (error, client) {
    if (error) {
      console.log(id + ': connect error ' + error.message);
      return;
    }

    const sendHeaders = {
      destination: '/queue/test',
      'content-type': 'text/plain',
    };

    const frame = client.send(sendHeaders);
    frame.write('hello');
    frame.end();

    const subscribeHeaders = {
      destination: '/queue/test',
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

        client.ack(message);

        client.disconnect();
      });
    });
  });
}
