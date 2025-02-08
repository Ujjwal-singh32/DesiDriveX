import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { OwnerContext } from "../context/OwnerContext";
import axios from 'axios'
const Profile = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(OwnerContext);
  const [ownerData, setOwnerData] = useState({
    profilePic: "",
    email: "",
    name: "",
    phoneNumber: "",
    pinCode: "",
    state: "",
  });

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/owners/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          //console.log(response.data.user)
          setOwnerData(response.data.owner); // Set owner data from the response
        } else {
          console.error("Failed to fetch owner data");
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
      }
    };
    fetchOwnerData();
  }, [token, backendUrl]);

  const handleEditProfile = () => {
    navigate("/edit-profile"); // Navigate to the edit profile page
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-14 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src={ownerData.profilePic}
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
            {`${ownerData.name}...` || "Loading..."}
          </h1>
        </div>

        {/* Address Grid Section */}
        <div className="flex items-center justify-center">
          {/* Address */}
          <div className="border p-4 rounded-lg shadow-md bg-gray-50">
            <div className="text-gray-600">
              <p>
                <strong>Email:</strong> {ownerData.email || "Loading..."}
              </p>
              <p>
                <strong>Phone:</strong> {ownerData.phoneNumber || "Loading..."}
              </p>
              <p>
                <strong>Pin Code:</strong> {ownerData.pinCode || "Loading..."}
              </p>
              <p>
                <strong>State:</strong> {ownerData.state || "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-b border-black-200 "></div>
      <div className="w-full py-6 px-2 mx-auto">
        <Footer />
      </div>
    </>
  );
};

export default Profile;
