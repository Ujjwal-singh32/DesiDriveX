import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const CarDetails = () => {
  const [car, setCar] = useState(null); // Initial state is null to handle loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { carId } = useParams();
  const navigate = useNavigate();
  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/cars/details/${carId}`
        );
        console.log(response.data.cardata[0]);
        setCar(response.data.cardata[0]);
        setLoading(false);
      } catch (err) {
        setError("Error fetching car details.");
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
    const interval = setInterval(fetchCarDetails, 3000);
    return () => clearInterval(interval);
  }, [carId]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error message if the API call fails
  }

  if (!car) {
    return <div>Car not found</div>; // If no car data is returned
  }
  // console.log(car)
  // console.log(car[0].name)
  const handleAccept = async (ownerPhoneNumber) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/admin/update-verification/${carId}`
      );

      if (response.data.success) {
        toast.success("Car verified successfully!");
        navigate("/");
        const emailresponse = await axios.get(
          `${backendUrl}/api/owners/details-byphone/${ownerPhoneNumber}`
        );
        console.log(emailresponse.data);
        if (emailresponse.data.success) {
          // now send the email
          const email = emailresponse.data.owner.email;
          console.log(email);
          const sendEmail = await axios.post(
            `${backendUrl}/api/admin/send-success`,
            { email }
          );

          if (sendEmail.data.success) {
            toast.success("owner notified");
          } else {
            toast.error("error sending email");
          }
        } else {
          toast.error("error fetching email");
        }
      } else {
        toast.error("Failed to update car verification.");
      }
    } catch (error) {
      console.error("Error updating car verification:", error);
      alert("Error occurred while updating car verification.");
    }
  };
  const handleReject = async (ownerPhoneNumber) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/delete-car/${carId}`
      );

      if (response.data.success) {
        toast.success("Car Rejected successfully!");
        const emailresponse = await axios.get(
          `${backendUrl}/api/owners/details-byphone/${ownerPhoneNumber}`
        );
        // console.log(emailresponse.data);
        if (emailresponse.data.success) {
          // now send the email
          const email = emailresponse.data.owner.email;
          //console.log(email);
          const sendEmail = await axios.post(
            `${backendUrl}/api/admin/send-reject`,
            { email }
          );

          if (sendEmail.data.success) {
            toast.success("owner notified");
          } else {
            toast.error("error sending email");
          }
        } else {
          toast.error("error fetching email");
        }
      } else {
        toast.error("Failed to Reject Car");
      }
    } catch (error) {
      console.error("Error updating car verification:", error);
      alert("Error occurred while updating car verification.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Car Details</h1>

        {/* Owner and Car Info */}
        <div className="mb-6">
          <p className="text-lg font-semibold">Owner: {car.ownerName}</p>
          <p className="text-lg font-semibold">
            Owner Phone: {car.ownerPhoneNumber}
          </p>
          <p className="text-lg font-semibold">Car Name: {car.name}</p>
          <p className="text-lg font-semibold">Model Year: {car.model}</p>
          <p className="text-lg font-semibold">
            Price Per Day: {car.pricePerDay}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Description:</h2>
          <p className="text-gray-700">{car.description}</p>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Uploaded Images:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {car.images &&
              car.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Car ${index + 1}`}
                  className="w-full h-48 object-cover rounded shadow-md"
                />
              ))}
          </div>
        </div>

        {/* Approve and Reject Buttons */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            onClick={() => handleAccept(car.ownerPhoneNumber)}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition
          "
            onClick={() => handleReject(car.ownerPhoneNumber)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
