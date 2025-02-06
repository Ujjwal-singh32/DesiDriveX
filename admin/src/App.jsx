import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import TotalCars from "./pages/TotalCars";
import TotalUsers from "./pages/TotalUsers";
import TotalOwners from "./pages/TotalOwners";
import Requests from "./pages/Requests";
import Cardetails from "./pages/Cardetails";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./pages/PrivateRoute";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TotalCars />
            </PrivateRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <Notification />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/total-users"
          element={
            <PrivateRoute>
              <TotalUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/total-owners"
          element={
            <PrivateRoute>
              <TotalOwners />
            </PrivateRoute>
          }
        />
        <Route
          path="/request"
          element={
            <PrivateRoute>
              <Requests />
            </PrivateRoute>
          }
        />
        <Route
          path="/viewcar/:carId"
          element={
            <PrivateRoute>
              <Cardetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
