import sys
import os
from process import initializeChannel, callback

queueToController = "controllerChannel"


def main():
    connection, channel = initializeChannel()

    channel.queue_declare(queue=queueToController)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(
        queue=queueToController, on_message_callback=callback, auto_ack=False)

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
