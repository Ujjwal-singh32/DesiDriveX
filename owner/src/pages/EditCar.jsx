import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { OwnerContext } from "../context/OwnerContext";
import axios from "axios";
import { toast } from "react-toastify";
const EditCar = () => {
  const navigate = useNavigate();

  const { backendUrl } = useContext(OwnerContext);
  const { carId } = useParams();
  // console.log("car Id", carId);
  const [carDetails, setCarDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/cars/details/${carId}`
        );
        //   console.log("car", response.data.cardata[0]);
        if (response.data.success) {
          //  console.log(response.data.cardata[0]);
          setCarDetails(response.data.cardata[0]);
        } else {
          setError("No cars found or failed to fetch data.");
        }
      } catch (err) {
        setError("Error fetching car data.");
      }
    };

    fetchCarDetails();
  }, []);
  //console.log('Cardetails' , carDetails)
  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails({ ...carDetails, [name]: value });
  };

  // Handler for file input changes for images
  const handleFileChange = (e, index) => {
    const updatedImages = [...carDetails.images];
    updatedImages[index] = e.target.files[0];
    setCarDetails((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
  };
  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("name", carDetails.name);
      formData.append("pricePerDay", carDetails.pricePerDay);
      formData.append("description", carDetails.description);
      formData.append("status", carDetails.status);

      // Append new images if uploaded
      carDetails.images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
        // console.log(image)
      });

      // Send the request
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]); // Logs key-value pairs
      // }
      const response = await axios.put(
        `${backendUrl}/api/cars/update-car/${carId}`,
        formData
      );

      if (response.data.success) {
        toast.success("Car details updated successfully!");
        navigate("/");
      } else {
        toast.error("Failed to update car details.");
      }
    } catch (error) {
      console.error("Error updating car details:", error);
      alert("Error updating car details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Edit Car Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Car Images */}
          <div>
            <h2 className="text-gray-700 font-medium mb-4">Current Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {carDetails.images?.map((image, index) => (
                <div key={index} className="text-center">
                  <img
                    src={image}
                    alt={`Car Image ${index + 1}`}
                    className="w-full max-w-[120px] h-auto mx-auto rounded-md shadow-md mb-2"
                  />
                  <label
                    htmlFor={`newImage-${index}`}
                    className="block text-sm text-gray-500 mb-2"
                  >
                    Replace Image {index + 1}
                  </label>
                  <input
                    type="file"
                    id={`newImage-${index}`}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Car Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Car Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={carDetails.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price per Day */}
          <div>
            <label
              htmlFor="pricePerDay"
              className="block text-gray-700 font-medium mb-2"
            >
              Price per Day ($)
            </label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={carDetails.pricePerDay}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={carDetails.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={carDetails.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-700 via-blue-800 to-purple-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;
