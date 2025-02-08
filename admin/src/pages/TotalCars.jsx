import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
const TotalCars = () => {
  const {
    backendUrl,
    totalCars,
    setTotalCars,
    cars,
  } = useContext(AdminContext);
  //console.log(cars)

  const handleDelete = async (carId) => {
   // console.log(carId)
    try {
      // Confirm deletion with the user
      const isConfirmed = window.confirm(
        "Are you sure you want to cancel the registration of this car?"
      );
      if (!isConfirmed) return;

      // Send the DELETE request
      const response = await axios.delete(
        `${backendUrl}/api/cars/delete/${carId}`
      );

      if (response.data.success) {
        toast.success("Car deleted successfully!");
      } else {
        toast.error("Failed to delete car.");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car.");
    }
    setTotalCars(totalCars - 1);
  };

  return (
    <div className="p-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Total Cars: {totalCars}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
          >
            {car.images[0] ? (
              <img
                src={car.images[0]}
                alt={car.model}
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
            <h2 className="text-lg font-semibold">Car: {car.name}</h2>
            <h2 className="text-lg font-semibold">Model: {car.model}</h2>
            <p>Owner: {car.ownerName}</p>
            <p>Registered: {new Date(car.createdAt).toLocaleDateString()}</p>
            <button
              onClick={() => handleDelete(car._id)}
              className="mt-4 bg-black text-white px-4 py-2 rounded shadow hover:bg-red-600  border-white"
            >
              Cancel Registration
            </button>
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300 mt-3"></div>
      <Footer />
    </div>
  );
};

export default TotalCars;
