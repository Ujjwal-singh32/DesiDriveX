import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { OwnerContext } from "../context/OwnerContext";

const Notify = () => {
  const { backendUrl, ownerId } = useContext(OwnerContext);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { bookingId } = useParams();
  const [ownerMessages, setOwnerMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/bookings/${bookingId}`
        );
        const booking = response.data.bookings;
        setUserId(booking.userId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setLoading(false);
      }
    };

    fetchBooking(); // Initially fetch the booking details
    const interval = setInterval(fetchBooking, 1000); // Regularly fetch booking details
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [bookingId]);

  useEffect(() => {
    if (userId) {
      // Fetch messages from both sides at regular intervals
      const messageInterval = setInterval(() => {
        fetchOwnerMessages();
        fetchUserMessages();
      }, 1000); // Fetch messages every 1 second

      return () => clearInterval(messageInterval); // Clean up the interval
    }
  }, [ownerId, bookingId, userId]);

  // Function to fetch chat messages from the owner (receiver)
  const fetchOwnerMessages = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/chats/messages/${bookingId}/${userId}/${ownerId}`
      );
      if (response.data.messages) {
        // Add senderId to the owner's messages
        const messagesWithSenderId = response.data.messages.map((msg) => ({
          ...msg,
          senderId: ownerId, // This is the owner sending the message
        }));
        setOwnerMessages(messagesWithSenderId);
      }
    } catch (error) {
      console.error("Error fetching owner messages:", error);
    }
  };

  // Function to fetch chat messages from the user (sender)
  const fetchUserMessages = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/users/detailsbyid/${userId}`
      );
      //console.log(response.data);
      setUsername(response.data.user.name);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
    try {
      const response = await axios.get(
        `${backendUrl}/api/chats/messages/${bookingId}/${ownerId}/${userId}`
      );
      if (response.data.messages) {
        // Add senderId to the user's messages
        const messagesWithSenderId = response.data.messages.map((msg) => ({
          ...msg,
          senderId: userId, // This is the user sending the message
        }));
        setUserMessages(messagesWithSenderId);
      }
    } catch (error) {
      console.error("Error fetching user messages:", error);
    }
  };

  // Function to send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: ownerId, // The owner is sending the message
      receiverId: userId, // The user is the receiver
      bookingId,
      message: newMessage,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/chats/send`,
        messageData
      );
      setOwnerMessages((prevMessages) => [
        ...prevMessages,
        response.data.chat.message,
      ]); // Add to ownerMessages (owner sends messages)
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Merge the messages from user and owner and sort them by timestamp
  const combinedMessages = [...userMessages, ...ownerMessages];
  const sortedMessages = combinedMessages.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Function to format the timestamp into a readable string
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">
        Chat with {username}
      </h2>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto border p-4 rounded-md bg-gray-100">
        {/* Display sorted and merged messages */}
        {sortedMessages.length > 0 ? (
          sortedMessages.map((msg, index) => {
            if (msg && msg.text) {
              const isOwnerMessage = msg.senderId === ownerId;
              return (
                <div
                  key={index}
                  className={`flex ${
                    isOwnerMessage ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 my-1 rounded-lg ${
                      isOwnerMessage
                        ? "bg-pink-400 text-white"
                        : "bg-purple-300"
                    }`}
                  >
                    {msg.text}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
      </div>

      {/* Input Box */}
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Notify;
