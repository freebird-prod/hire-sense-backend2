import express from "express";
const mailRoutes = express.Router();
import { sendMail, sendAllMails } from "../controllers/mailController.js";
mailRoutes.post("/send-email", sendMail);
mailRoutes.post("/send-all-emails", sendAllMails);
export default mailRoutes;
