import Chat from "../models/Chat";

// Create New Chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const newChat = new Chat({
      userId,
      userName: req.user.name,
      name: "New Chat",
      messages: [],
    });
    await newChat.save();
    res.status(201).json({
      message: "Chat created successfully",
      chat: newChat,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get User Chats
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json({ chats, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// Delete Chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found", success: false });
    }
    res.status(200).json({ message: "Chat deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};