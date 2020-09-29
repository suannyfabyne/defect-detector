import { publishToQueue } from "../rabbitmq";

export const sendMessageToQueue = async (req, res) => {
  const message = req.body;
  await publishToQueue(JSON.stringify(message));
  console.log(" [x] Sent " + JSON.stringify(message));

  res.status(201).send({ msg: "Sended", body: { ...message } });
};
