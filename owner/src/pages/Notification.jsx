import React, { useContext } from "react";
import { OwnerContext } from "../context/OwnerContext";
import axios from "axios";
import { toast } from "react-toastify";
const Notification = () => {
  const {
    notifications,
    unreadCount,
    backendUrl,
    setNotifications,
    setUnreadCount,
    ownerName,
  } = useContext(OwnerContext);

  const handleAccept = async (id, bookingId, senderId, receiverId) => {
    // here we have to send the notification to the user that owner has accepted the work and also
    // will mark the notification as read and decrease the total count of the notification

    try {
      await axios.put(
        `${backendUrl}/api/notification/update-notification/${id}`,
        {}
      );
      const updatedNotifications = notifications.map((notification) =>
        notification._id === id
          ? { ...notification, status: "read" }
          : notification
      );
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Error updating notification status:", error);
    }

    // now send the notification to the user
    try {
      const response = await axios.post(
        `${backendUrl}/api/notification/new-notification`,
        {
          bookingId: bookingId,
          senderId: receiverId,
          receiverId: senderId,
          message: `${ownerName} Has Accepted Your Renting Offer`,
        }
      );

      if (response.data.success) {
        console.log("notification sent");
      } else {
        toast.error("Somenthing went Wrong");
      }
    } catch (error) {
      console.error(
        "Error creating notification:",
        error.response?.data || error.message
      );
    }

    // at last update booking status to accepted in the booking
    try {
      const updateBooking = await axios.patch(
        `${backendUrl}/api/bookings/${bookingId}/status`,
        {
          bookingId: bookingId,
          status: "Upcoming",
        }
      );
      if (updateBooking.data.success) {
        toast.success("Booking Accepted");
      } else {
        toast.error("Error Accepting the Booking");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // a function to reject the offer and updating the notifcation
  const handleReject = async (id, bookingId, senderId, receiverId) => {
    // here we have to send the notification to the user that owner has rejected the work and also
    // will mark the notification as read and decrease the total count of the notification

    try {
      await axios.put(
        `${backendUrl}/api/notification/update-notification/${id}`,
        {}
      );
      const updatedNotifications = notifications.map((notification) =>
        notification._id === id
          ? { ...notification, status: "read" }
          : notification
      );
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Error updating notification status:", error);
    }

    // now send the notification to the user
    try {
      const response = await axios.post(
        `${backendUrl}/api/notification/new-notification`,
        {
          bookingId: bookingId,
          senderId: receiverId,
          receiverId: senderId,
          message: `${ownerName} Has Rejected Your Renting Offer`,
        }
      );

      if (response.data.success) {
        console.log("notification sent");
      } else {
        toast.error("Something went Wrong");
      }
    } catch (error) {
      console.error(
        "Error creating notification:",
        error.response?.data || error.message
      );
    }

    // at last update booking status to accepted in the booking
    try {
      const updateBooking = await axios.patch(
        `${backendUrl}/api/bookings/${bookingId}/status`,
        {
          bookingId: bookingId,
          status: "Cancelled",
        }
      );
      if (updateBooking.data.success) {
        toast.success("Booking Cancelled");
      } else {
        toast.error("Error Cancelling the Booking");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sort notifications: unread first
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.status === "unread" && b.status === "read") return -1;
    if (a.status === "read" && b.status === "unread") return 1;
    return 0;
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
        Notifications
      </h1>
      <p className="text-lg md:text-xl mb-4 md:mb-6 text-center">
        Unread Notifications: <span className="font-bold">{unreadCount}</span>
      </p>
      <div className="flex flex-col gap-4">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`w-full bg-white border border-gray-300 rounded-lg shadow-md p-3 md:p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center ${
                notification.status === "read" ? "opacity-75" : ""
              }`}
            >
              <div className="flex-1">
                <p className="text-base md:text-lg font-semibold">
                  {notification.message}
                </p>
                <p className="text-sm text-gray-600 mt-1 md:mt-2">
                  Status: {notification.status}
                </p>
              </div>
              {notification.status === "unread" && (
                <div className="flex flex-row md:flex-row gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() =>
                      handleAccept(
                        notification._id,
                        notification.bookingId,
                        notification.senderId,
                        notification.receiverId
                      )
                    }
                    className="bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-lg hover:bg-green-600 w-full md:w-auto"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        notification._id,
                        notification.bookingId,
                        notification.senderId,
                        notification.receiverId
                      )
                    }
                    className="bg-red-500 text-white text-sm md:text-base px-3 py-2 rounded-lg hover:bg-red-600 w-full md:w-auto"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm md:text-base">
            No notifications to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notification;
