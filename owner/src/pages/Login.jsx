import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OwnerContext } from "../context/OwnerContext";

const Login = () => {
  const { token, setToken, backendUrl, ownerId } = useContext(OwnerContext);
  const [currentstate, setCurrentState] = useState("Login");
  const navigate = useNavigate();
  //console.log(ownerId)
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setemail] = useState("");

  // Address Fields State

  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePic, setProfilePic] = useState(null); // State for profile picture

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setemail(newEmail);
    localStorage.setItem(`userEmail_${newEmail}`, newEmail);
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(); // Use FormData for handling file upload

      if (currentstate === "Sign Up") {
        // Append all data to FormData
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("pinCode", pinCode);
        formData.append("state", state);
        formData.append("phoneNumber", phoneNumber);
        if (profilePic) {
          formData.append("profilePic", profilePic);
        }

        const response = await axios.post(
          `${backendUrl}/api/owners/register`,
          formData,
          {}
        );

        if (response.data.success) {
          toast.success("Registration Successful");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);

          const fetchOwnerData = async () => {
            try {
              const response = await axios.get(
                `${backendUrl}/api/owners/details`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (response.data.success) {
                //console.log(response.data.user)
                const fetchedOwnerId = response.data.owner._id;
                //  setOwnerId(fetchedOwnerId);
                localStorage.setItem("ownerId", fetchedOwnerId);
              } else {
                console.error("Failed to fetch owner data");
              }
            } catch (error) {
              console.error("Error fetching owner data:", error);
            }
          };
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/owners/login`, {
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Login Successful");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const ForgotPassHandler = () => {
    navigate("/forgot-password");
  };

  return (
    <div>
      <form
        onSubmit={onsubmitHandler}
        className="flex flex-col items-center w-[90%] sm:w-[500px] m-auto mt-14 gap-4 text-black-800 border-2 border-purple-300 p-6 rounded-lg"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl  ">{currentstate}</p>
          <hr className="border-none h-[1.5px] w-8 bg-black-800" />
        </div>

        {/* Form Fields */}
        {currentstate === "Login" ? (
          <>
            <input
              onChange={handleEmailChange}
              value={email}
              className="w-full px-3 py-2 border border-black-800"
              type="email"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              className="w-full px-3 py-2 border border-black-800"
              type="password"
              placeholder="Password"
              required
            />{" "}
          </>
        ) : (
          <>
            <input
              onChange={(e) => setname(e.target.value)}
              value={name}
              className="w-full px-3 py-2 border border-black-800"
              type="text"
              placeholder="Username"
              required
            />
            <input
              onChange={handleEmailChange}
              value={email}
              className="w-full px-3 py-2 border border-black-800"
              type="email"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              className="w-full px-3 py-2 border border-black-800"
              type="text"
              placeholder="Phone Number"
              required
            />
            <input
              onChange={(e) => setPinCode(e.target.value)}
              value={pinCode}
              className="w-full px-3 py-2 border border-black-800"
              type="text"
              placeholder="Pin Code"
              required
            />
            <input
              onChange={(e) => setState(e.target.value)}
              value={state}
              className="w-full px-3 py-2 border border-black-800"
              type="text"
              placeholder="State"
              required
            />
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              className="w-full px-3 py-2 border border-black-800"
              type="password"
              placeholder="Password"
              required
            />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="w-full px-3 py-2 border border-black-800"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </>
        )}

        {/* Profile Picture Upload */}
        {currentstate === "Sign Up" && (
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Upload Profile Picture
            </label>
            <input
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full px-3 py-2 border border-black-800"
              type="file"
              accept="image/*"
            />
          </div>
        )}

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer mt-2" onClick={ForgotPassHandler}>
            Forgot Password
          </p>
          {currentstate === "Login" ? (
            <p
              className="cursor-pointer mt-2"
              onClick={() => {
                setCurrentState("Sign Up");
              }}
            >
              Create Account
            </p>
          ) : (
            <p
              className="cursor-pointer mt-2 "
              onClick={() => {
                setCurrentState("Login");
              }}
            >
              Login Here
            </p>
          )}
        </div>

        <button className="bg-gradient-to-r sticky top-0 z-50 from-pink-700 via-blue-800 to-purple-500 text-white text-sm px-8 py-2 mt-4 shadow-md">
          {currentstate === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
