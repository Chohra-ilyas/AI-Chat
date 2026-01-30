import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    messages: [
      {
        isImage: {
          type: Boolean,
          default: false,
          required: true,
        },
        isPublished: {
          type: Boolean,
          default: false,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;