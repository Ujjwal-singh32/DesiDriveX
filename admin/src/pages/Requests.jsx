import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios"; // Make sure to install axios
import { toast } from "react-toastify";
const Requests = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Ensure `requests` is always an array, set initial state to an empty array
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car details from the API
  useEffect(() => {
    const fetchPendingCars = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/pending-cars`
        );
        //console.log(response.data.cardata);
        setRequests(response.data.cardata || []); // Use empty array if `response.data.cars` is undefined or null
        setLoading(false);
      } catch (err) {
        setError("Error fetching requests.");
        setLoading(false);
      }
    };

    fetchPendingCars();
    const interval = setInterval(fetchPendingCars, 2000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Approve request handler
  const handleApprove = async (carId, ownerPhoneNumber) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/admin/update-verification/${carId}`
      );

      if (response.data.success) {
        toast.success("Car verified successfully!");
        // fetch the email of the owner by phone number then send the email
        // console.log(ownerPhoneNumber)
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

  // View request handler
  const handleView = (requestId) => {
    navigate(`/viewcar/${requestId}`);
  };

  // Reject request handler
  const handleReject = async (carId, ownerPhoneNumber) => {
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

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div className="text-center">No Request</div>; // Show error message if API call fails
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Car Upload Requests
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b w-20">Image</th>
                <th className="p-4 border-b">Owner Name</th>
                <th className="p-4 border-b">Car Model</th>
                <th className="p-4 border-b">Car Year</th>
                <th className="p-4 border-b">Car Price</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-100">
                    <td className="p-4 border-b">
                      <img
                        src={request.images[0]}
                        alt={`${request.carModel}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 border-b">{request.ownerName}</td>
                    <td className="p-4 border-b">{request.model}</td>
                    <td className="p-4 border-b">{request.year}</td>
                    <td className="p-4 border-b">{request.pricePerDay}</td>
                    <td className="p-4 border-b">
                      <span
                        className={`py-1 px-3 rounded-full text-white text-sm ${
                          request.status === "Available"
                            ? "bg-green-500"
                            : request.status === "Approved"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 mt-3 flex justify-center gap-2">
                      {request.status === "Available" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(request._id);
                          }}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                        >
                          View
                        </button>
                      )}
                      {request.status === "Available" && (
                        <button
                          onClick={(e) => {
                            handleApprove(
                              request._id,
                              request.ownerPhoneNumber
                            );
                            e.stopPropagation();
                          }}
                          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                      )}
                      {request.status === "Available" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(request._id, request.ownerPhoneNumber);
                          }}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No pending car requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border-b border-gray-300 mt-3"></div>
      <Footer />
    </div>
  );
};

export default Requests;
