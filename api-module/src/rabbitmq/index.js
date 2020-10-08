import amqp from "amqplib/callback_api";

let channel = null;
const queueToController = "controllerChannel";
const queueToAPI = "apiChannel";

const rabbitConnection = () => {
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) throw err;

    conn.createChannel((error, ch) => {
      if (error) throw error;

      ch.assertQueue(queueToAPI, {
        durable: false,
      });

      ch.assertQueue(queueToController, {
        durable: false,
      });

      channel = ch;

      consumeFromQueue(queueToAPI);
    });
  });
};

rabbitConnection();

export const publishToQueue = async (data) => {
  channel.sendToQueue(queueToController, Buffer.from(data), {
    persistent: true,
  });
};

export const consumeFromQueue = async (queueReceiver) => {
  channel.consume(
    queueReceiver,
    (msg) => {
      console.log(" [x] Received %s", msg.content.toString());
      channel.ack(msg);
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
