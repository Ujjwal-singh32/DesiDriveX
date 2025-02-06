import React, { useContext } from "react";
import Footer from "../components/Footer";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const TotalUsers = () => {
  const {
    backendUrl,
    users,
    setUsers,
    totalUsers,
    setTotalUsers,
  } = useContext(AdminContext);

  const handleDelete = async (userId) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete the User?"
      );
      if (!isConfirmed) return;

      const response = await axios.delete(
        `${backendUrl}/api/admin/delete-user/${userId}`
      );

      if (response.data.success) {
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
        setTotalUsers((prevTotal) => prevTotal - 1);
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Total Users: {totalUsers}
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="p-4 border-b font-semibold">{user.name}</td>
                  <td className="p-4 border-b">{user.email}</td>
                  <td className="p-4 border-b">{user.phoneNumber}</td>
                  <td className="p-4 border-b">
                    <span
                      className={`py-1 px-3 rounded-full text-white text-sm ${
                        user.status === "Active"
                          ? "bg-yellow-500"
                          : user.status === "Inactive"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td className="p-4 border-b">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border-b border-gray-400 "></div>
      <div className="w-full py-6 px-2 mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default TotalUsers;
