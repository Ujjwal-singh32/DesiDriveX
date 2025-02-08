import React from "react";
import logo from "../assets/carassets/logo.png";
import Footer from "../components/Footer";
const Profile = () => {
  const userData = {
    profilePic: logo,
    name: "Ujjwal...",
    details: {
      Email: "admin@desidrivex.com",
      PhoneNumber: "9341658004",
      PinCode: "845420",
      State: "Bihar",
    },
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-14 p-6 bg-white shadow-lg rounded-lg overflow-x-hidden">
        <div className="text-center mb-6 overflow-x-hidden">
          <div className="flex justify-center mb-4">
            <img
              src={userData.profilePic || assets.profile_icon}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
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
                <strong>Email:</strong> {userData.details.Email || "Loading..."}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {userData.details.PhoneNumber || "Loading..."}
              </p>
              <p>
                <strong>Pin Code:</strong>{" "}
                {userData.details.PinCode || "Loading..."}
              </p>
              <p>
                <strong>State:</strong> {userData.details.State || "Loading..."}
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
