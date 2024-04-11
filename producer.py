import stomp

class Producer(stomp.ConnectionListener):
    def on_error(self, _, message):
        print('received an error:', message)
    def on_message(self, _, message):
        print('received a message:', message)

# Setup connection
conn = stomp.Connection(host_and_ports=[('localhost', 61616)])
conn.set_listener('', Producer())
conn.connect('artemis', 'artemis', wait=True)  # Default credentials, change as necessary

# Send a message
for _ in range(10):
  conn.send(body='AAPL 150.50', destination='/queue/STOCK.QUEUE')
conn.disconnect()
