import amqp from "amqplib/callback_api";

let channel = null;
const queue = "hello";

const rabbitConnection = () => {
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, ch) => {
      if (err) throw err;

      ch.assertQueue(queue, {
        durable: false,
      });

      channel = ch;
    });
  });
};

rabbitConnection();

export const publishToQueue = async (data) => {
  channel.sendToQueue(queue, Buffer.from(data), { persistent: true });
};

export const consumeFromQueue = async () => {
  channel.consume(
    queue,
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
