import { createContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export const OwnerContext = createContext();
export const useOwner = () => {
  return useContext(OwnerContext);
};

const OwnerContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);
  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");
    console.log("local", storedOwnerId);
    if (storedOwnerId) {
      setOwnerId(storedOwnerId);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    if (token) {
      const fetchOwnerData = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/owners/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            //console.log(response.data.user)
            const fetchedOwnerId = response.data.owner._id;
            setOwnerId(fetchedOwnerId);
            setOwnerName(response.data.owner.name);
            setOwnerPhoneNumber(response.data.owner.phoneNumber);
            localStorage.setItem("ownerId", fetchedOwnerId);
          } else {
            console.error("Failed to fetch owner data");
          }
        } catch (error) {
          console.error("Error fetching owner data:", error);
        }
      };
      fetchOwnerData();
    }
  }, [token, backendUrl]);
  // console.log(ownerId)
  useEffect(() => {
    if (ownerId) {
      localStorage.setItem("ownerId", ownerId);
    }
  }, [ownerId]);
  // for notification fetching
  useEffect(() => {
    if (ownerId) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/notification/get-notification/${ownerId}`
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
  }, [ownerId, backendUrl]);
  // console.log("notification" , notifications)
  // console.log("unread coutnt" , unreadCount)
  const value = {
    token,
    setToken,
    backendUrl,
    ownerId,
    setOwnerId,
    ownerName,
    setOwnerName,
    ownerPhoneNumber,
    setOwnerPhoneNumber,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
  };

  return (
    <OwnerContext.Provider value={value}>
      {props.children}
    </OwnerContext.Provider>
  );
};

export default OwnerContextProvider;
