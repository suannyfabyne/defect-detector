import Product from "../db/schemas/product";
import amqp from "amqplib/callback_api";

let channel = null;
const queueToAPI = "apiChannel";
var exchange = "products_exc";

const rabbitConnection = () => {
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) throw err;

    conn.createChannel((error, ch) => {
      if (error) throw error;

      ch.assertExchange(exchange, "direct", {
        durable: false,
      });

      channel = ch;

      consumeFromQueue(queueToAPI);
    });
  });
};

rabbitConnection();

export const publishToQueue = async (data, routingKey) => {
  channel.publish(exchange, routingKey, Buffer.from(data), {
    persistent: true,
  });
};

export const consumeFromQueue = async (queueReceiver) => {
  channel.consume(
    queueReceiver,
    async (msg) => {
      const receivedMessage = msg.content.toString();

      console.log(" [x] Received %s", receivedMessage);
      channel.ack(msg);

      const receivedObject = JSON.parse(receivedMessage);

      try {
        await Product.create(receivedObject);
        console.log("Created on MongoDB");
      } catch (e) {
        console.log(e);
      }
    },
    {
      noAck: false,
    }
  );
};

process.on("exit", (code) => {
  channel.close();
  console.log(`Closing rabbitmq channel`);
});
