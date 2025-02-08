import React, { useState, useContext } from "react";
import Footer from "../components/Footer";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
const TotalOwner = () => {
  const { backendUrl, owners, totalOwners, setTotalOwners } = useContext(
    AdminContext
  );

  const handleDelete = async (ownerId) => {
    try {
      // Confirm deletion with the admin
      const isConfirmed = window.confirm(
        "Are you sure you want to delete the owner?"
      );
      if (!isConfirmed) return;

      // Send the DELETE request
      const response = await axios.delete(
        `${backendUrl}/api/admin/delete-owner/${ownerId}`
      );

      if (response.data.success) {
        toast.success("owner deleted successfully!");
      } else {
        toast.error("Failed to delete owner.");
      }
    } catch (error) {
      console.error("Error deleting owner:", error);
      alert("Error deleting owner.");
    }
    setTotalOwners(totalOwners - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Total Owners: {totalOwners}
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">State</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner._id} className="hover:bg-gray-100">
                  <td className="p-4 border-b font-semibold">{owner.name}</td>
                  <td className="p-4 border-b">{owner.email}</td>
                  <td className="p-4 border-b">{owner.phoneNumber}</td>
                  <td className="p-4 border-b">
                    <span
                      className={`py-1 px-3 rounded-full text-white text-sm ${
                        owner.status === "Active"
                          ? "bg-yellow-500"
                          : owner.status === "Inactive"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {owner.status || "Active"}
                    </span>
                  </td>
                  <td className="p-4 border-b">{owner.state}</td>
                  <td className="p-4 border-b">
                    <button
                      onClick={() => handleDelete(owner._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                    >
                      Delete Owner
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

export default TotalOwner;
