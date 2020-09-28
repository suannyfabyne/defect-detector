import Express from "express";
import { sendMessageToQueue } from "../controllers/messages";

const router = Express.Router();

router.post("/send-message", sendMessageToQueue);

export default router;
