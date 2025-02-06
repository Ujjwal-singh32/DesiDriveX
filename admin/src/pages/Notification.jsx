import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const Notification = () => {
  const {
    backendUrl,
    token,
    notifications,
    setNotifications,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
  } = useContext(AdminContext);

  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${backendUrl}/api/admin/contact-us-update/${id}`);

      // Update local state after marking as read
      setLocalNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, hasRead: true }
            : notification
        )
      );

      setUnreadNotificationsCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  // Sort notifications: unread first
  const sortedNotifications = [...localNotifications].sort((a, b) => {
    if (!a.hasRead && b.hasRead) return -1;
    if (a.hasRead && !b.hasRead) return 1;
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us Request</h1>
      <p className="text-xl mb-6">
        Unread Notifications: <span className="font-bold">{unreadNotificationsCount}</span>
      </p>
      <div className="flex flex-col gap-4">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2 ${
                notification.hasRead ? "opacity-75" : ""
              }`}
            >
              <p className="text-lg font-semibold">Name: {notification.name}</p>
              <p className="text-md text-gray-700">Email: {notification.email}</p>
              <p className="text-md text-gray-700">Phone: {notification.phoneNumber}</p>
              <p className="text-md text-gray-900 font-medium">Message: {notification.message}</p>
              <div className="flex justify-end mt-3">
                {!notification.hasRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No notifications to display.</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
