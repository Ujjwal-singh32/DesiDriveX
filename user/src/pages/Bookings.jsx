import { React, useState, useContext, useEffect } from "react";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom"; 
const Bookings = () => {
  const { token, setToken, backendUrl } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const bookingsResponse = await axios.get(
          `${backendUrl}/api/bookings/user-bookings/${userId}`
        );
        console.log(bookingsResponse); // Check API response
        const bookingsData = bookingsResponse.data.bookings; // Extract bookings array

        const updatedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            const carResponse = await axios.get(
              `${backendUrl}/api/cars/details/${booking.carId}`
            );
            const carData = carResponse.data.cardata[0];
            //console.log("carId" ,booking.carId )
            //console.log("cardata" , carData[0].ownerName)

            return {
              ...booking,
              carName: carData.name,
              image: carData.images[0],
              ownerName: carData.ownerName,
              ownerPhoneNumber: carData.ownerPhoneNumber,
            };
          })
        );

        setBookings(updatedBookings);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  const handleCompleteBooking = async (id) => {
    try {
      const updateBooking = await axios.patch(
        `${backendUrl}/api/bookings/${id}/status`,
        {
          bookingId: id,
          status: "Completed",
        }
      );
      if (updateBooking.data.success) {
        toast.success("Booking Completed");
      } else {
        toast.error("Error in Completing the Booking");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Status color mapping
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
      case "Pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const handleBookingStatus = async (id) => {
    try {
      const updateBooking = await axios.patch(
        `${backendUrl}/api/bookings/${id}/status`,
        {
          bookingId: id,
          status: "Cancelled",
        }
      );
      if (updateBooking.data.success) {
        toast.success(
          "Booking Cancelled And Money Will refunded within 4 Days"
        );
      } else {
        toast.error("Error in Cancelling the Booking");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-800 py-4">
            My Bookings
          </h1>
        </div>
      </header>

      {/* Bookings List */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  className="w-full h-40 object-cover"
                  src={booking.image}
                  alt={booking.carName}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.carName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Booking Date:{" "}
                    {new Date(booking.bookingDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Return Date:{" "}
                    {new Date(booking.returnDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Owner: {booking.ownerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mobile: {booking.ownerPhoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Charges: ₹ {booking.charges}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    Status: {booking.status}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    {(booking.status === "Confirmed" ||
                      booking.status === "Pending") && (
                      <button
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none"
                        onClick={() => handleBookingStatus(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === "Started" && (
                      <button
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 focus:outline-none"
                        onClick={() => handleCompleteBooking(booking._id)}
                      >
                        Complete
                      </button>
                    )}
                    <button className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-purple-700 focus:outline-none"
                    onClick={()=>navigate(`/notify/${booking._id}`)}>
                      Notify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div className="border-b border-black-200 "></div>
      <div className="w-full py-6 px-2 mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Bookings;
