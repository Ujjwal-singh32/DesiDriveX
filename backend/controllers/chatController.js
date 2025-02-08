import chatModel from "../models/chatModel.js";

const sendMessage = async (req, res) => {
  const { senderId, receiverId, bookingId, message } = req.body;

  try {
    // Check if a chat already exists for the given sender and receiver
    const chat = await chatModel.findOne({
      senderId,
      receiverId,
      bookingId,
    });

    if (chat) {
      // If the chat exists, push the message into it
      chat.messages.push({ text: message, timestamp: new Date() });
      await chat.save();

      //console.log("Message added to existing chat:", chat);
      return res.status(200).json({ success: true, chat });
    } else {
      // If the chat doesn't exist, create a new one
      console.log(message);
      const newChat = new chatModel({
        senderId,
        receiverId,
        bookingId,
        messages: [{ text: message, timestamp: new Date() }],
      });

      await newChat.save();

      // console.log("New chat created:", newChat);
      return res.status(200).json({ success: true, chat: newChat });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { senderId, receiverId,bookingId } = req.params;

  if (!senderId || !receiverId || !bookingId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required parameters." });
  }

  try {
    // Find the chat with the exact senderId and receiverId
    const chat = await chatModel.findOne({ senderId, receiverId,bookingId });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found." });
    }

    // Return the messages in the chat
    res.status(200).json({
      success: true,
      totalMessages: chat.messages.length,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


export {
  sendMessage,
  getMessages,
};
