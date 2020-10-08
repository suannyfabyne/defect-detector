import { getProductReport, sendMessageToQueue } from "../controllers/messages";

import Express from "express";

const router = Express.Router();

router.post("/send-message", sendMessageToQueue);
router.get("/list-report", getProductReport);

export default router;
