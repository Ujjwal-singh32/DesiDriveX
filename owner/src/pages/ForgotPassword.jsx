import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OwnerContext } from "../context/OwnerContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(OwnerContext);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + "/api/passwords/owners/forgot-password",
        {
          email,
        }
      );
      if (response.data.success) {
        toast.success("Password reset link sent to your email!");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-[90%] sm:w-[500px] m-auto mt-14 gap-4 text-black-800 border-2 border-black-300 p-6 rounded-lg"
        >
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">Forgot Password</p>
            <hr className="border-none h-[1.5px] w-8 bg-black-800" />
          </div>

          {/* Input Field */}
          <input
            onChange={handleEmailChange}
            value={email}
            className="w-full px-3 py-2 rounded border-gray-300 mt-5 border-r-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Enter your Email"
            required
          />

          {/* Button Container with Flexbox and Justify Between */}
          <div className="w-full mt-4 flex sm:flex-row flex-col justify-between gap-4">
            <button className="bg-gradient-to-r from-pink-700 via-blue-800 to-purple-500 text-white text-sm px-8 py-2 rounded-lg w-full sm:w-auto">
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-gray-600 text-white text-sm px-8 py-2 rounded-lg hover:bg-gray-700 w-full sm:w-auto"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
