import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { backendUrl } = useContext(AdminContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      //console.log(backendUrl)
      // console.log(email)
      // console.log(password)
      const response = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:w-[400px] m-auto mt-20 gap-4 text-black-800 border-2 border-purple-300 p-6 rounded-lg"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <p className="prata-regular text-2xl">Admin Login</p>
          <hr className="border-none h-[1.5px] w-8 bg-black-800" />
        </div>

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="w-full px-3 py-2 border border-black-800"
          type="email"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="w-full px-3 py-2 border border-black-800"
          type="password"
          placeholder="Password"
          required
        />

        <button className="bg-gradient-to-r from-pink-700 via-blue-800 to-purple-500 text-white text-sm px-8 py-2 mt-4 shadow-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
