import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
const Payment = () => {
  const { token, setToken, backendUrl, userId, username } = useContext(
    UserContext
  );
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const navigate = useNavigate();
  const location = useLocation();
  const { car, startDate, endDate, totalDistance, totalPrice } =
    location.state || {}; // Get car details passed from Car Details page

  console.log("Car Details for Booking:", car);
  // Mock function for Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      // Call the backend to create a Razorpay order
      const { data } = await axios.post(
        `${backendUrl}/payment-method/create-razorpay-order`,
        {
          amount: totalPrice, // Amount in ₹ (converted to paise in backend)
        }
      );

      // Dynamically load Razorpay checkout script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.RAZORPAY_KEY_ID,
          amount: data.amount * 100, // Amount in paise
          currency: data.currency,
          name: "DesiDriveX",
          description: "Payment for Order",
          order_id: data.orderId,
          handler: async function (response) {
            try {
              // 1️⃣ Verify payment with backend
              const verifyResponse = await axios.post(
                `${backendUrl}/payment-method/verify-razorpay`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );

              if (verifyResponse.data.success) {
                console.log("Payment Verified Successfully!");

                // 2️⃣ Create Booking Only if Payment is Verified
                const bookingResponse = await axios.post(
                  `${backendUrl}/api/bookings/create`,
                  {
                    ownerId: car.ownerId,
                    userId: userId,
                    carId: car._id,
                    bookingDate: startDate,
                    returnDate: endDate,
                    charges: totalPrice,
                    paymentMethod: "Razorpay",
                  }
                );
                if (bookingResponse.data.success) {
                  toast.success("Booking Confirmed");
                  // console.log("Booking Confirmed:", bookingResponse.data.booking._id);

                  // also send the notification to the owner

                  try {
                    const response = await axios.post(
                      `${backendUrl}/api/notification/new-notification`,
                      {
                        bookingId: bookingResponse.data.booking._id,
                        senderId: userId,
                        receiverId: car.ownerId,
                        message: `You Have a Renting Offer From ${username}`,
                      }
                    );

                    if (response.data.success) {
                      console.log("notification sent");
                      navigate("/my-bookings");
                    } else {
                      toast.error("Somenthing went Wrong");
                    }
                  } catch (error) {
                    console.error(
                      "Error creating notification:",
                      error.response?.data || error.message
                    );
                  }
                } else {
                  toast.error("Error in Booking");
                }
              } else {
                console.error("Payment verification failed");
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error(
                "Error during payment verification or booking:",
                error
              );
              alert("Something went wrong. Please try again.");
            }
          },
          prefill: {
            name: "Your Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      };
    } catch (err) {
      console.error("Razorpay Payment Error:", err);
    }
  };

  const handleCreditCardPayment = async () => {
    try {
      const bookingResponse = await axios.post(
        `${backendUrl}/api/bookings/create`,
        {
          ownerId: car.ownerId,
          userId: userId,
          carId: car._id,
          bookingDate: startDate,
          returnDate: endDate,
          charges: totalPrice,
          paymentMethod: "Card",
        }
      );
      if (bookingResponse.data.success) {
        toast.success("Booking Confirmed");
        console.log("Booking Confirmed:", bookingResponse.data);
        // also send the notification to the owner

        try {
          const response = await axios.post(
            `${backendUrl}/api/notification/new-notification`,
            {
              bookingId: bookingResponse.data.booking._id,
              senderId: userId,
              receiverId: car.ownerId,
              message: `You Have a Renting Offer From ${username}`,
            }
          );

          if (response.data.success) {
            console.log("notification sent");
            navigate("/my-bookings");
          } else {
            toast.error("Somenthing went Wrong");
          }
        } catch (error) {
          console.error(
            "Error creating notification:",
            error.response?.data || error.message
          );
        }
      } else {
        toast.error("Error in Booking");
      }
    } catch (error) {
      toast.error("Error in Booking");
      console.log(error);
    }
    navigate("/my-bookings");
  };

  const handlecashpayment = async () => {
    try {
      const bookingResponse = await axios.post(
        `${backendUrl}/api/bookings/create`,
        {
          ownerId: car.ownerId,
          userId: userId,
          carId: car._id,
          bookingDate: startDate,
          returnDate: endDate,
          charges: totalPrice,
          paymentMethod: "Cash",
        }
      );
      if (bookingResponse.data.success) {
        toast.success("Booking Confirmed");
        console.log("Booking Confirmed:", bookingResponse.data);
        // also send the notification to the owner

        try {
          const response = await axios.post(
            `${backendUrl}/api/notification/new-notification`,
            {
              bookingId: bookingResponse.data.booking._id,
              senderId: userId,
              receiverId: car.ownerId,
              message: `You Have a Renting Offer From ${username}`,
            }
          );

          if (response.data.success) {
            console.log("notification sent");
            navigate("/my-bookings");
          } else {
            toast.error("Somenthing went Wrong");
          }
        } catch (error) {
          console.error(
            "Error creating notification:",
            error.response?.data || error.message
          );
        }
      } else {
        toast.error("Error in Booking");
      }
    } catch (error) {
      toast.error("Error in Booking");
      console.log(error);
    }
    navigate("/my-bookings");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-blue-400 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Secure Payment
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Complete your payment to confirm your booking.
        </p>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Select Payment Method:
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">Credit/Debit Card</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                }}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">Razorpay</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">Cash</span>
            </label>
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === "creditCard" && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </form>
        )}

        {paymentMethod === "razorpay" && (
          <div className="text-center py-4">
            <p className="text-gray-700">
              You will be redirected to Razorpay to complete your payment
              securely.
            </p>
            <button
              onClick={handleRazorpayPayment}
              className="w-full mt-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-md shadow-md"
            >
              Pay with Razorpay
            </button>
          </div>
        )}

        {/* Payment Button for Credit/Debit Card */}
        {paymentMethod === "creditCard" && (
          <button
            onClick={handleCreditCardPayment}
            className="w-full mt-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-blue-600 rounded-md shadow-md"
          >
            Pay Now
          </button>
        )}
        {paymentMethod === "COD" && (
          <button
            onClick={handlecashpayment}
            className="w-full mt-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-blue-600 rounded-md shadow-md"
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;
