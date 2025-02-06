import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { OwnerContext } from "../context/OwnerContext";
const EditProfile = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(OwnerContext);
  // Initial state to hold user data
  const [ownerData, setOwnerData] = useState({
    name: "",
    pinCode: "",
    state: "",
    phoneNumber: "",
    profilePic: "",
    email: "",
  });

  const [profilePic, setProfilePic] = useState(null); // To hold the selected profile picture file

  // Fetch owner data on component mount
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/owners/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setOwnerData(response.data.owner); // Set user data from the response
        } else {
          console.error("Failed to fetch owner data");
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
      }
    };
    fetchOwnerData();
  }, [token, backendUrl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("user data", userData);
    const formData = new FormData();
    formData.append("name", ownerData.name);
    formData.append("pinCode", ownerData.pinCode);
    formData.append("state", ownerData.state);
    formData.append("email", ownerData.email);
    formData.append("phoneNumber", ownerData.phoneNumber);

    // // Only append the profile picture if the user has selected a new one
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    // // for (let [key, value] of formData.entries()) {
    // //   console.log(`${key}: ${value}`);
    // // }

    try {
      const response = await axios.put(
        `${backendUrl}/api/owners/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Profile updated successfully
        toast.success("Profile updated successfully");
        navigate("/profile"); // Redirect to the profile page
      } else {
        console.error("Failed to update profile");
        toast.error("Failed to update profile: " + response.data.message);
      }
    } catch (error) {
      toast.error(
        "Error: " + (error.response?.data?.message || "Something went wrong")
      );
      console.error("Error updating profile:", error);
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
        const { name, value } = e.target;
        setOwnerData((prevData) => {
          const newData = { ...prevData, [name]: value };
          //console.log('Updated ownerData:', newData);
          return newData;
        });
  };

  // Handle profile picture selection
  const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setProfilePic(file); // Set the selected file
        }
  };

  return (
    <div className="max-w-4xl mx-auto mt-14 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={ownerData.profilePic || "/path/to/default-profile-pic.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={ownerData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={ownerData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <label
              htmlFor="pinCode"
              className="block text-sm font-medium text-gray-700"
            >
              Pin Code
            </label>
            <input
              type="number"
              id="pinCode"
              name="pinCode"
              value={ownerData.pinCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={ownerData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={ownerData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Profile Picture File Upload */}
          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-pink-700 via-blue-800 to-purple-500 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
