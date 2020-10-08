import Express from "express";
import amqp from "amqplib/callback_api";
import { createMongoConnection } from "./db";
import messageRouter from "./routes/messages";

export class Server {
  app = Express();

  startup = async () => {
    await createMongoConnection();
    this.app.use(Express.urlencoded({ extended: true }));
    this.app.use(Express.json());
    this.setupRoutes();
    this.app.listen(3001, () => console.log("Listening..."));
  };

  setupRoutes = () => {
    this.app.get("/test", (req, res) => {
      res.send("Working :)");
    });

    this.app.use("/", messageRouter);
  };
}
