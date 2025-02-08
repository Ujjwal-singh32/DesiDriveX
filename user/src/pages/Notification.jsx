import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Notification = () => {
  const {
    notifications,
    unreadCount,
    backendUrl,
    setNotifications,
    setUnreadCount,
  } = useContext(UserContext);

  const markAsRead = async (id) => {
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

      // updating the context
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="bg-blue-500 text-white text-sm md:text-base px-3 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto mt-3 md:mt-0"
                >
                  Mark as Read
                </button>
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
