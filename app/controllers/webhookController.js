import dotenv from "dotenv";
import request from "request";
import User from "../models/user.js";
import Conversation from "../models/conversations.js";
import Message from "../models/message.js";
import axios from "axios";
dotenv.config();

const handleMessage = async (webhookevent) => {
  let user = await User.find({});
  let sender_psid = webhookevent.sender.id;
  let receiver_psid = user[0]._id;


  let url = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${process.env.PAGETOKEN}`;
  try {
    var response = await axios.get(url);
  } catch (error) {
    console.log(error);
  }



  let conversations = await Conversation.find({ senderId: sender_psid });
  console.log(conversations);




  if (conversations.length === 0) {
    let conversation = new Conversation({
      members: [sender_psid, receiver_psid],
      senderId: sender_psid,
      receipientId: webhookevent.recipient.id,
    });
    conversation.save((err, convo) => {
      if (err) {
        console.log(err);
      } else {

       
   
        let message = new Message({
          conversationId: convo._id,
          sender: sender_psid,
          text: webhookevent.message.text,
          image: response.data.profile_pic
        });

        message.save((err, msg) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Success check DB");
          }
        });
      }
    });
  } else {
    let id = conversations[0]._id;
    let message = new Message({
      conversationId: id,
      sender: sender_psid,
      text: webhookevent.message.text,
      image: response.data.profile_pic
    });

    message.save((err, msg) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Success check DB");
      }
    });
  }
};

const webhookController = () => {
  return {
    getWebhook(req, res) {
      console.log(req.query);
      let VERIFY_TOKEN = process.env.TOKEN;

      // Parse the query params
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];

      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          // Responds with the challenge token from the request
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
        }
      }
    },
    postWebhook(req, res) {
      let body = req.body;

      // Checks this is an event from a page subscription
      if (body.object === "page") {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
          // Gets the body of the webhook event
          let webhook_event = entry.messaging[0];
          console.log(webhook_event);

          // Get the sender PSID
          let sender_psid = webhook_event.sender.id;
          console.log("Sender PSID: " + sender_psid);

          // Check if the event is a message or postback and
          // pass the event to the appropriate handler function
          if (webhook_event.message) {
            handleMessage(webhook_event);
          } else if (webhook_event.postback) {
            console.log("Ignore");
          }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");
      } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
      }
    },
    async fetchConvos(req, res) {
      let conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    },
    async createMessage(req, res) {
      let requiredConvo = await Conversation.find({
        _id: req.body.conversationId,
      });
      let receipientId = requiredConvo[0].senderId;

      let request_body = {
        recipient: {
          id: receipientId,
        },
        message: {
          text: req.body.text,
        },
      };
      let response = await axios.post(
        `https://graph.facebook.com/v12.0/me/messages?access_token=${process.env.PAGETOKEN}`,
        request_body
      );
      let message = new Message(req.body);
      message.save((err, msg) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(msg);
        }
      });
    },
    async getMessages(req, res) {
      let messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    },
    async getCustomerDetails(req, res) {
      let customerId = req.params.customerId;
      console.log(customerId);
      let url = `https://graph.facebook.com/${customerId}?fields=first_name,last_name,profile_pic&access_token=${process.env.PAGETOKEN}`;
      try {
        let data = await axios.get(url);
        console.log("request comes from convo");
        res.status(200).json(data.data);
      } catch (error) {
        console.log(error);
      }
    },
  };
};

export default webhookController;
