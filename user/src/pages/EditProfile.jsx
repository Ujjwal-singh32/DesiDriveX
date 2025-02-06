import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const EditProfile = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(UserContext);
  // Initial state to hold user data
  const [userData, setUserData] = useState({
    name: "",
    pinCode: "",
    state: "",
    phoneNumber: "",
    profilePic: "",
    email: "",
  });

  const [profilePic, setProfilePic] = useState(null); // To hold the selected profile picture file

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data.user); // Set user data from the response
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [token, backendUrl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("user data", userData);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("pinCode", userData.pinCode);
    formData.append("state", userData.state);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);

    // // Only append the profile picture if the user has selected a new one
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    // // for (let [key, value] of formData.entries()) {
    // //   console.log(`${key}: ${value}`);
    // // }

    try {
      const response = await axios.put(
        `${backendUrl}/api/users/update-profile`,
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
    setUserData((prevData) => {
      const newData = { ...prevData, [name]: value };
      //console.log('Updated userData:', newData);
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
            src={userData.profilePic || "/path/to/default-profile-pic.jpg"}
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
              value={userData.name}
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
              value={userData.email}
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
              value={userData.pinCode}
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
              value={userData.state}
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
              value={userData.phoneNumber}
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
