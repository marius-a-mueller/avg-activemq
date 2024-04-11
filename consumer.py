import time
import stomp

class Consumer(stomp.ConnectionListener):
    def on_error(self, _, message):
        print('received a message "%s"' % message)
    def on_message(self, _, message):
        print('received a message "%s"' % message)

conn = stomp.Connection(host_and_ports=[('localhost', 61616)])
conn.set_listener('', Consumer())
conn.connect('artemis', 'artemis', wait=True)  # Default credentials, change as necessary
conn.subscribe(destination='/queue/STOCK.QUEUE', id=1, ack='auto')

# Use a sleep loop to keep the script running while waiting for messages
try:
    while True:
        time.sleep(10)
except KeyboardInterrupt:
    conn.disconnect()
