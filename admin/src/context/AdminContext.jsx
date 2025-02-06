import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();
export const useAdmin = () => {
  return useContext(AdminContext);
};

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [cars, setCars] = useState([]); // State to hold car details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCars, setTotalCars] = useState(0);
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [owners, setOwners] = useState([])
  const [totalOwners, setTotalOwners] = useState(0)
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  // Fetch token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  // Fetch all cars details
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/cars/total-cars-model`
        );
        setCars(response.data.cars); 
        setTotalCars(response.data.cars.length)
        setLoading(false);
      } catch (err) {
        setError("Error fetching car details.");
        setLoading(false);
      }
    };

    if (token) {
      fetchCars();
    }
    const interval = setInterval(fetchCars, 2000);
    return () => clearInterval(interval);

  }, [token, backendUrl]);

  // fetch total users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/total-users`
        );
        setUsers(response.data.users); 
        setTotalUsers(response.data.users.length)
        setLoading(false);
      } catch (err) {
        setError("Error fetching user details.");
        setLoading(false);
      }
    };

    if (token) {
        fetchUsers();
    }
    const interval = setInterval(fetchUsers, 2000);
    return () => clearInterval(interval);
  }, [token, backendUrl]);

  // fetch total owners
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/total-owners`
        );
        setOwners(response.data.owners); 
        setTotalOwners(response.data.owners.length)
        setLoading(false);
      } catch (err) {
        setError("Error fetching owner details.");
        setLoading(false);
      }
    };

    if (token) {
        fetchOwners();
        const interval = setInterval(fetchOwners, 2000);
    return () => clearInterval(interval);
    }

  }, [token, backendUrl]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/contact-us-get`
        );
        console.log(response.data[0].message)
        setNotifications(response.data);

        // Count unread notifications
        const unreadCount = response.data.filter(
          (notif) => notif.hasRead === false
        ).length;
      
        setUnreadNotificationsCount(unreadCount);
      } catch (err) {
        setError("Error fetching notifications.");
      }
    };

    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000); // Optional: fetch every 5 seconds
      return () => clearInterval(interval);
    }
  }, [token, backendUrl]);

// console.log(users)
// console.log(owners)
  const value = {
    token,
    setToken,
    backendUrl,
    cars,
    loading,
    error,
    totalCars,
    setTotalCars,
    users,
    setUsers,
    totalUsers,
    setTotalUsers,
    owners,
    setOwners,
    totalOwners,
    setTotalOwners,
    notifications,
    setNotifications,
    unreadNotificationsCount,
    setUnreadNotificationsCount
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
