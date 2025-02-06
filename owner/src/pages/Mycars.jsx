import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { OwnerContext } from "../context/OwnerContext";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
const ManageCars = () => {
  const { token, backendUrl } = useContext(OwnerContext);
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      const ownerId = localStorage.getItem("ownerId");
      if (!ownerId) {
        setError("Owner ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        // Replace with the actual backend URL
        console.log(ownerId);
        const response = await axios.get(
          `${backendUrl}/api/cars/total-cars/${ownerId}`
        );

        if (response.data.success) {
          //console.log(response.data.cars);
          const fetchedCars = response.data.cars;

          // Fetch total bookings & revenue for each car
          const updatedCars = await Promise.all(
            fetchedCars.map(async (car) => {
              try {
                const [bookingsRes, revenueRes] = await Promise.all([
                  axios.get(`${backendUrl}/api/cars/total-bookings/${car._id}`),
                  axios.get(`${backendUrl}/api/cars/total-revenue/${car._id}`),
                ]);

                return {
                  ...car,
                  bookings: bookingsRes.data.totalBookings || 0,
                  revenue: revenueRes.data.totalRevenue || 0,
                };
              } catch (err) {
                console.error("Error fetching booking/revenue data:", err);
                return { ...car, bookings: 0, revenue: 0 }; // Default values on failure
              }
            })
          );

          setCars(updatedCars);
          //setCars(response.data.cars);
        } else {
          setError("No cars found or failed to fetch data.");
        }
      } catch (err) {
        setError("No car Added.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [token, backendUrl]);

  // If still loading or there is an error
  if (loading) {
    return <div>Loading cars...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleDelete = async (carId) => {
    try {
      // Confirm deletion with the user
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this car?"
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
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Manage Cars
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Image</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Price/Day</th>
                <th className="p-4 border-b">Bookings</th>
                <th className="p-4 border-b">Car Model</th>
                <th className="p-4 border-b">Revenue</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-100">
                  <td className="p-4 border-b">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-16 h-16 rounded"
                    />
                  </td>
                  <td className="p-4 border-b font-semibold">{car.name}</td>
                  <td className="p-4 border-b">
                    <span
                      className={`py-1 px-3 rounded-full text-white text-sm ${
                        car.status === "Available"
                          ? "bg-green-500"
                          : car.status === "Rented"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="p-4 border-b">₹{car.pricePerDay}</td>
                  <td className="p-4 border-b">{car.bookings}</td>
                  <td className="p-4 border-b">{car.model}</td>
                  <td className="p-4 border-b">₹{Math.ceil(car.revenue)}</td>
                  <td className="p-4 border-b">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition mr-2"
                      onClick={() => navigate(`/edit-car/${car._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition mr-2 mt-2"
                      onClick={() => handleDelete(car._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border-b border-black-200 "></div>
      <div className="w-full py-6 px-2 mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ManageCars;
