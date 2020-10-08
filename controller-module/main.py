import pika
import sys
import os
import json
import time
import random


def processData(data, channel, connection, method):
    obj = json.loads(data)
    obj['defective'] = bool(random.randint(0, 1))
    time.sleep(random.randint(1, 3))

    channel.basic_ack(delivery_tag=method.delivery_tag)

    channel.queue_declare(queue='controllerChannel', durable=False)
    channel.basic_publish(
        exchange='', routing_key='controllerChannel', body=json.dumps(obj),  properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))
    print(f" [x] Sent {json.dumps(obj)}")


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='apiChannel')

    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)
        processData(body, ch, connection, method)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(
        queue='apiChannel', on_message_callback=callback, auto_ack=False)

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
