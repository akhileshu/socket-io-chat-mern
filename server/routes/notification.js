import express from "express";
import {
  AddNotification,
  accessNotifications,
  deleteNotification,
} from "../controllers/notification.js";

const router = express.Router();
// url ->root/api/notification && all routes are protected
// currently logged in user can do this all to his account
router
  .post("/", AddNotification)
  .get("/", accessNotifications)
  .delete("/delete", deleteNotification);
export default router;
