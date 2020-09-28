import { publishToQueue } from "../rabbitmq";

export const sendMessageToQueue = async (req, res) => {
  const message = req.body;
  await publishToQueue([message]);

  res.status(201).send({ msg: "Sended", body: { ...message } });
};
