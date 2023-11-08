import express from "express";
import { accessChat, addtogroup, createGroupChat, fetchChats, removefromgroup, renameGroupChat } from "../controllers/chat.js";

const router = express.Router();
// url ->root/api/chat && all routes are protected
router
  .post("/", accessChat) //can [access (if present)/create (if not present)] chat
  .get("/", fetchChats) //fetch all chats for that user
  .post("/create-grp", createGroupChat) //for creating a chat group
  .patch("/rename-grp", renameGroupChat) //for renameing a chat group
  .patch("/remove-from-grp", removefromgroup) 
  .patch("/add-to-grp", addtogroup);
export default router;
