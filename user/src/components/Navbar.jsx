import React, { useState, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/carassets/logo.png";
import { assets } from "../assets/frontend_assets/assets";
import notification from "../assets/logos_kaarya/notification.png";
import { Link, useNavigate } from "react-router-dom"; // Import Link component
import { UserContext } from "../context/UserContext";
const Navbar = () => {
  const { token, setToken, backendUrl,unreadCount } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) {
      setIsProfileOpen(false);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  const notify = () => {
    navigate("/notification");
  };

  const toggleserver = () => {
    window.location.replace(import.meta.env.VITE_OWNER_URL);
  };
  const toggleserver1 = () => {
    window.location.replace(import.meta.env.VITE_ADMIN_URL);
  };
  const logout = () => {
    navigate("/login");
    setIsProfileOpen(false);
    localStorage.removeItem("token");
    setToken("");
  };
  return (
    <nav className="bg-gradient-to-r sticky top-0 z-50 from-pink-700 via-blue-800 to-purple-500 text-white shadow-md ">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="CarLending Logo" className="w-10 h-10 mr-2" />
          </Link>
          <span className="text-xl font-extrabold hidden md:block">
            DesiDriveX
          </span>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex space-x-6 text-xl font-semibold">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          <Link to="/my-bookings" className="hover:text-gray-300">
            Bookings
          </Link>
          <Link to="/cars" className="hover:text-gray-300">
            Cars
          </Link>
          <Link to="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </div>

        {/* Icons for Notifications and Profile */}
        <div className="flex space-x-10 items-center relative">
          {/* Notification Icon */}
          <div className="relative flex items-center">
            <img
              src={notification}
              alt="Notifications"
              className="w-9 h-9 cursor-pointer"
              onClick={notify}
            />
            <span className="absolute top-0 right-0 bg-pink-500 text-white rounded-full text-xs px-1">
              {unreadCount}
            </span>
          </div>

          {/* Profile Picture */}
          <div
            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
            onClick={() => {
              toggleProfileMenu();
              setIsMenuOpen(false);
            }}
          >
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-full mt-3 right-[-60px] backdrop-blur-lg text-black shadow-lg rounded-lg w-40 py-2 transition-all duration-200 ease-in-out opacity-100">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-purple-100 text-sm font-semibold"
                onClick={() => setIsProfileOpen(false)}
              >
                My Profile
              </Link>
              <p
                className="block px-4 py-2 hover:bg-purple-100 text-sm font-semibold cursor-pointer"
                onClick={logout}
              >
                Logout
              </p>
              <Link
                className="block px-4 py-2 hover:bg-purple-100 text-sm font-semibold"
                onClick={() => {
                  setIsProfileOpen(false), toggleserver();
                }}
              >
                Owner Login
              </Link>
              <Link
                className="block px-4 py-2 hover:bg-purple-100 text-sm font-semibold"
                onClick={() => {
                  setIsProfileOpen(false), toggleserver1();
                }}
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Menu - Mobile/Tablet */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-pink-900 via-gray-900 to-black text-white absolute top-18 left-1/2 transform -translate-x-1/2 w-80 py-4">
          <Link
            to="/"
            className="block px-4 py-2 hover:bg-gray-800 text-sm font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/my-bookings"
            className="block px-4 py-2 hover:bg-gray-800 text-sm font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Bookings
          </Link>
          <Link
            to="/cars"
            className="block px-4 py-2 hover:bg-gray-800 text-sm font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Cars
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 hover:bg-gray-800 text-sm font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 hover:bg-gray-800 text-sm font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
      <div className="border-b border-black"></div>
    </nav>
  );
};

export default Navbar;
