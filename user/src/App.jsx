import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPass from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Notification from "./pages/Notification";
import Bookings from "./pages/Bookings";
import CarDetails from "./pages/CarDetails";
import Payment from "./pages/Payment";
import { ToastContainer } from "react-toastify";
import Notify from "./pages/Notify";
const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/my-bookings" element={<Bookings />} />
        <Route path="/car-details/:carId" element={<CarDetails />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/notify/:bookingId" element={<Notify />} />
      </Routes>
    </div>
  );
};

export default App;
