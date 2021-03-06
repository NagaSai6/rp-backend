import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: [{type:String}],
    senderId:{type:String},
    receipientId:{type:String}
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation",ConversationSchema,'conversations')

export default Conversation;