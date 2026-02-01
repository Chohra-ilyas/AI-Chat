import ai from "../config/openAI.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import imagekit from "../config/imageKit.js";

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

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.credits < 2) {
      return res.status(403).json({
        message: "you need more credits to use this feature",
        success: false,
      });
    }
    const { chatId, prompt, isPublished } = req.body;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found", success: false });
    }
    chat.messages.push({ role: "user", content: prompt, isImage: false });

    const endcodedPrompt = encodeURIComponent(prompt);

    const generateImageUrl = `${process.env.URL_ENDPOINT}/
    ik-genimg-prompt-${endcodedPrompt}/AI-Chat/${Date.now()}.png?tr=w-800,h-800`;

    const AIImageResponse = await axios.get(generateImageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      AIImageResponse.data,
      "binary",
    ).toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "AI-Chat",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      isPublished,
      isImage: true,
    };
    
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
    res
      .status(200)
      .json({
        message: "Image generated successfully",
        data: reply,
        success: true,
      });
  } catch (error) {}
};

const extractMessage = (response) => {
  return response.candidates[0].content.parts[0].text;
};
