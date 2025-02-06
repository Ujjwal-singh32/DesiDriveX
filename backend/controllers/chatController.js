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

// const getTotalWorkers = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res
//       .status(400)
//       .json({ success: false, error: "User ID is required." });
//   }

//   try {
//     const chats = await chatmodel.find({
//       $or: [{ senderId: userId }, { receiverId: userId }],
//     });

//     if (!chats || chats.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, error: "No workers found for this user." });
//     }
//     const workerIds = new Set();

//     // if in chat if the user is sender then the reciever is the worker and vice versa

//     chats.forEach((chat) => {
//       if (chat.senderId !== userId) {
//         workerIds.add(chat.senderId); // The sender is a worker
//       }
//       if (chat.receiverId !== userId) {
//         workerIds.add(chat.receiverId); // The receiver is a worker
//       }
//     });

//     // send the array
//     res.status(200).json({ success: true, workers: Array.from(workerIds) });
//   } catch (error) {
//     console.error("Error in getting Total Workers:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

// const getTotalUsers = async (req, res) => {
//     const { workerId } = req.params;

//     if (!workerId) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Worker ID is required." });
//     }

//     try {
//       const chats = await chatmodel.find({
//         $or: [{ senderId: workerId }, { receiverId: workerId }],
//       });
//       if (!chats || chats.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, error: "No users found for this worker." });
//       }

//       const userIds = new Set();

//       chats.forEach((chat) => {
//         if (chat.senderId !== workerId) {
//           userIds.add(chat.senderId); // The sender is a user
//         }
//         if (chat.receiverId !== workerId) {
//           userIds.add(chat.receiverId); // The receiver is a user
//         }
//       });

//     // convert to array before sending the request
//       res.status(200).json({ success: true, users: Array.from(userIds) });
//     } catch (error) {
//       console.error("Error in get Total Users:", error);
//       res.status(500).json({ success: false, error: "Internal server error" });
//     }
// };

export {
  sendMessage,
  getMessages,
  //   userDetails,
  //   workerDetails,
  //   getTotalWorkers,
  //   getTotalUsers,
};
