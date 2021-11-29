import express from "express";
import lc from "../controllers/loginController.js";
import wc from "../controllers/webhookController.js";

const router = express.Router();

router.post("/login", lc().fblogin);
router.get("/webhook",wc().getWebhook)
router.post("/webhook",wc().postWebhook)

export default router;
