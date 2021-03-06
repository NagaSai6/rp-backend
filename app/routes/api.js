import express from "express";
import lc from "../controllers/loginController.js";
import wc from "../controllers/webhookController.js";


const router = express.Router();


router.get("/webhook",wc().getWebhook)
router.get("/:userId",wc().fetchConvos)
router.get("/messages/:conversationId",wc().getMessages)
router.get("/customers/:customerId",wc().getCustomerDetails);

router.post("/login", lc().fblogin);
router.post("/webhook",wc().postWebhook)
router.post("/message",wc().createMessage)


export default router;
