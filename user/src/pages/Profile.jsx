import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/carassets/logo.png";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import axios from "axios";
const Profile = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(UserContext);
  // fetch data from the backend and display it
  const [userData, setUserData] = useState({
    profilePic: "",
    email: "",
    name: "",
    phoneNumber: "",
    pinCode: "",
    state: "",
  });

  //console.log(token)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          //console.log(response.data.user)
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

  const handleEditProfile = () => {
    navigate("/edit-profile"); // Navigate to the edit profile page
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-14 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-10 ">
          My Profile
        </h1>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src={userData.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <button
              onClick={handleEditProfile}
              className="mt-20 text-pink-500 border border-purple-500 rounded-md px-2"
            >
              Edit
            </button>
          </div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {`${userData.name}...` || "Loading..."}
          </h1>
        </div>

        {/* Address Grid Section */}
        <div className="flex items-center justify-center">
          {/* Address */}
          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <div className="text-gray-600">
              <p>
                <strong>Email:</strong> {userData.email || "Loading..."}
              </p>
              <p>
                <strong>Phone:</strong> {userData.phoneNumber || "Loading..."}
              </p>
              <p>
                <strong>Pin Code:</strong> {userData.pinCode || "Loading..."}
              </p>
              <p>
                <strong>State:</strong> {userData.state || "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-b border-gray-200 mt-20"></div>
      <div className="w-full py-6 px-2 mx-auto">
        <Footer />
      </div>
    </>
  );
};

export default Profile;
