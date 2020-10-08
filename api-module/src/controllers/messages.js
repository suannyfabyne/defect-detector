import Product from "../db/schemas/product";
import { publishToQueue } from "../rabbitmq";

export const sendMessageToQueue = async (req, res) => {
  const message = req.body;
  const messageParsed = JSON.stringify(message);

  try {
    await publishToQueue(messageParsed, message.type);

    console.log("[x] Sent " + messageParsed);
    res.status(200).send({ msg: "Sent", body: { ...message } });
  } catch (e) {
    console.log(e);
    res.status(400).send({ msg: "Failed to send" });
  }
};

export const getProductReport = async (req, res) => {
  try {
    const response = await Product.find();
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(400).send({ msg: "Failed to list" });
  }
};
