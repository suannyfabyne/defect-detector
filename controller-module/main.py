import sys
import os
from process import initializeChannel, callback

queueToController = "controllerChannel"
productTypes = ['shirt', 'shoe', 'hat']
exchange = 'products_exc'


def main():
    connection, channel = initializeChannel()

    channel.exchange_declare(exchange=exchange, exchange_type='direct')
    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue

    for productType in productTypes:
        channel.queue_bind(
            exchange=exchange, queue=queue_name, routing_key=productType)

    channel.basic_qos(prefetch_count=1)

    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=False)

    print(' [*] Waiting for messages. To exit press CTRL+C')

    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
