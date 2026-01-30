import Message from "../models/Message.js";

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const { chatId, prompt } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found", success: false });
    }
    chat.messages.push({ role: "user", content: prompt, isImage: false });
    await chat.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};