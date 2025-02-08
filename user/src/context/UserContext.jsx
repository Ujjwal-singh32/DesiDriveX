import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("local", storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/users/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            //console.log(response.data.user)
            const fetchedUserId = response.data.user._id;
            setUserId(fetchedUserId);
            setUsername(response.data.user.name);
            localStorage.setItem("userId", fetchedUserId);
            // console.log("user Id", userId);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [token, backendUrl]);
  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/notification/get-notification/${userId}`
          );
          if (response.data.success) {
            setNotifications(response.data.data);
            // Count unread notifications
            const unread = response.data.data.filter(
              (notif) => notif.status === "unread"
            ).length;
            setUnreadCount(unread);
          } else {
            console.error("Failed to fetch notifications");
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 3000);
      return () => clearInterval(interval);
    }
  }, [userId, backendUrl]);
  const value = {
    token,
    setToken,
    backendUrl,
    userId,
    setUserId,
    username,
    setUsername,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export default UserContextProvider;
