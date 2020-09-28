import Express from "express";
import amqp from "amqplib/callback_api";
import messageRouter from "./routes/messages";

export class Server {
  app = Express();

  startup() {
    this.app.use(Express.urlencoded({ extended: true }));
    this.app.use(Express.json());
    this.setupRoutes();
    this.app.listen(3001, () => console.log("Listening..."));
  }

  setupRoutes() {
    this.app.get("/teste", (req, res) => {
      res.send("Funcionando :)");
    });

    this.app.use("/", messageRouter);
  }
}
