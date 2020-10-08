
import pika
import json
import time
import random

queueToAPI = "apiChannel"


def initializeChannel():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost'))
    return connection, connection.channel()


def classifyProduct(data):
    receivedProduct = json.loads(data)
    receivedProduct['defective'] = bool(random.randint(0, 1))
    time.sleep(random.randint(1, 3))

    return receivedProduct


def resendData(data, channel, method):

    modifiedProduct = classifyProduct(data)

    channel.basic_ack(delivery_tag=method.delivery_tag)
    channel.queue_declare(queue=queueToAPI, durable=False)

    channel.basic_publish(
        exchange='', routing_key=queueToAPI, body=json.dumps(modifiedProduct),  properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))

    print(f" [x] Sent {json.dumps(modifiedProduct)}")


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    resendData(body, ch, method)
