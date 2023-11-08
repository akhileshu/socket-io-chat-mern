import express from "express";
import { allMessages, sendMessage } from "../controllers/message.js";

const router = express.Router();
// url ->root/api/message- one on one and gruop chat message api
router.post("/", sendMessage).get("/:chatId", allMessages);

export default router;
