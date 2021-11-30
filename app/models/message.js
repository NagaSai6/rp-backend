import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: { type: String },
    image:{type:String}
  },
  { timestamps: true }
);

const Message = mongoose.model(
  "Message",
  MessageSchema,
  "messages"
);

export default Message;
