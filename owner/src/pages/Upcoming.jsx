import { React, useContext, useState, useEffect } from "react";
import Footer from "../components/Footer";
import { OwnerContext } from "../context/OwnerContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Upcoming = () => {
  const { token, setToken, backendUrl } = useContext(OwnerContext);
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      case "Accepted":
        return "text-blue-600";
      case "Started":
        return "text-purple-600";
      case "Upcoming":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      const ownerId = localStorage.getItem("ownerId");
      try {
        const bookingsResponse = await axios.get(
          `${backendUrl}/api/bookings/owner-bookings/${ownerId}`
        );
        //console.log(bookingsResponse); // Check API response
        const bookingsData = bookingsResponse.data.bookings; // Extract bookings array

        const updatedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            const carResponse = await axios.get(
              `${backendUrl}/api/cars/details/${booking.carId}`
            );
            const carData = carResponse.data.cardata[0];
            //console.log("carId" ,booking.carId )
            //console.log("cardata" , carData[0].ownerName)
            const userResponse = await axios.get(
              `${backendUrl}/api/users/detailsbyid/${booking.userId}`
            );
            // console.log(userResponse.data.user)
            return {
              ...booking,
              carName: carData.name,
              image: carData.images[0],
              userName: userResponse.data.user.name,
              userPhoneNumber: userResponse.data.user.phoneNumber,
            };
          })
        );
        updatedBookings.sort((a, b) => {
          const statusOrder = [
            "Upcoming",
            "Pending",
            "Accepted",
            "Started",
            "Completed",
            "Cancelled",
          ];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
    
        setBookings(updatedBookings);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  const handleSendCar = async (id) => {
    try {
      console.log(id);
      const updateBooking = await axios.patch(
        `${backendUrl}/api/bookings/${id}/status`,
        {
          bookingId: id,
          status: "Started",
        }
      );
      if (updateBooking.data.success) {
        toast.success("Booking Updated to Started");
      } else {
        toast.error("Error in Updating the booking the Booking");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChat = (id) => {
    navigate(`/notify/${id}`)
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Upcoming Bookings
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Car Image</th>
                <th className="p-4 border-b">Car Name</th>
                <th className="p-4 border-b">Customer Name</th>
                <th className="p-4 border-b">Mobile No.</th>
                <th className="p-4 border-b">Start Date</th>
                <th className="p-4 border-b">End Date</th>
                <th className="p-4 border-b">Price</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Actions</th>
                <th className="p-4 border-b">Notify</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="p-4 border-b">
                    <img
                      src={booking.image}
                      alt={booking.carName}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 border-b font-semibold">
                    {booking.carName}
                  </td>
                  <td className="p-4 border-b">{booking.userName}</td>
                  <td className="p-4 border-b">{booking.userPhoneNumber}</td>
                  <td className="p-4 border-b">
                    {new Date(booking.bookingDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 border-b">
                    {new Date(booking.returnDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 border-b">
                    ₹{Math.ceil(booking.charges)}
                  </td>
                  <td
                    className={`p-4 border-b font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </td>
                  <td className="p-4 border-b">
                    {booking.status === "Upcoming" && (
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                        onClick={() => handleSendCar(booking._id)}
                      >
                        Send Car
                      </button>
                    )}
                  </td>
                  <td className="p-4 border-b">
                    <button
                      className="bg-pink-400 text-white py-1 px-3 rounded hover:bg-purple-500 transition"
                      onClick={() => handleChat(booking._id)}
                    >
                      Chat Now
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

export default Upcoming;
