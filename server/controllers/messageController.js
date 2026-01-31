import ai from "../config/openAI.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

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

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const reply = extractMessage(response);
    
    chat.messages.push({ role: "assistant", content: reply, isImage: false });
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
    res.status(200).json({ message: reply, success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const extractMessage = (response) => {
  return response.candidates[0].content.parts[0].text;
};
