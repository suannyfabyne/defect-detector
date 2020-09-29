import amqp from "amqplib/callback_api";

let channel = null;
const queue = "apiChannel";

const rabbitConnection = () => {
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) throw err;

    conn.createChannel((error, ch) => {
      if (error) throw error;

      ch.assertQueue(queue, {
        durable: false,
      });

      channel = ch;

      consumeFromQueue("controllerChannel");
    });
  });
};

rabbitConnection();

export const publishToQueue = async (data) => {
  channel.sendToQueue(queue, Buffer.from(data), { persistent: true });
};

export const consumeFromQueue = async (queueReceiver) => {
  channel.consume(
    queueReceiver,
    (msg) => {
      console.log(" [x] Received %s", msg.content.toString());
    },
    {
      noAck: true,
    }
  );
};

process.on("exit", (code) => {
  channel.close();
  console.log(`Closing rabbitmq channel`);
});
