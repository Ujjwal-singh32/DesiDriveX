import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { OwnerContext } from "../context/OwnerContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AddCar = () => {
  const navigate = useNavigate();
  const {
    backendUrl,
    ownerId,
    setOwnerId,
    ownerName,
    setOwnerName,
    ownerPhoneNumber,
    setOwnerPhoneNumber,
  } = useContext(OwnerContext);
  console.log("owner", ownerName);
  console.log("ownerphoen", ownerPhoneNumber);
  const [carDetails, setCarDetails] = useState({
    name: "",
    model: "",
    year: "",
    pricePerDay: "",
    description: "",
    ownerId: ownerId,
    type: "",
    transmission: "",
    fuelType: "",
    images: Array(6).fill(null),
    ownerName: ownerName,
    ownerPhoneNumber: ownerPhoneNumber,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...carDetails.images];
    updatedImages[index] = e.target.files[0];
    setCarDetails((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
  };

  useEffect(() => {
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      ownerId: ownerId,
      ownerName: ownerName,
      ownerPhoneNumber: ownerPhoneNumber,
    }));
  }, [ownerId, ownerName, ownerPhoneNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("cardetails",carDetails);
    try {
      const formData = new FormData();
      formData.append("name", carDetails.name);
      formData.append("model", carDetails.model);
      formData.append("year", carDetails.year);
      formData.append("pricePerDay", carDetails.pricePerDay);
      formData.append("description", carDetails.description);
      formData.append("ownerId", carDetails.ownerId);
      formData.append("type", carDetails.type);
      formData.append("transmission", carDetails.transmission);
      formData.append("fuelType", carDetails.fuelType);
      formData.append("ownerName", carDetails.ownerName);
      formData.append("ownerPhoneNumber", carDetails.ownerPhoneNumber);

      carDetails.images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
       // console.log(image);
      });

      const res = await axios.post(`${backendUrl}/api/cars/register`, formData);

      if (res.data.success) {
        toast.success("Car details submitted successfully!");
        setCarDetails({
          name: "",
          model: "",
          year: "",
          pricePerDay: "",
          description: "",
          ownerId: "",
          type: "",
          transmission: "",
          fuelType: "",
          images: Array(6).fill(null),
        });
        navigate("/upcoming")
      } else {
        toast.error("Failed to submit car details.");
      }
    } catch (error) {
      console.error("Error submitting car details:", error);
      toast.error("Error submitting car details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="w-full max-w-4xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl border-2 border-purple-500">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Add New Car
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Car Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Upload Car Images (6 Images Required)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {carDetails.images.map((image, index) => (
                <div key={index} className="text-center">
                  <label
                    htmlFor={`image-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Image {index + 1}
                  </label>
                  <input
                    type="file"
                    id={`image-${index}`}
                    name={`image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Car Name */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Car Name
            </label>
            <input
              type="text"
              name="name"
              value={carDetails.name}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter car name"
              required
            />
          </div>

          {/* Car Model */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={carDetails.model}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter car model"
              required
            />
          </div>

          {/* Car Year */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={carDetails.year}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter car year"
              required
            />
          </div>

          {/* Price per Day */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Price per Day
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={carDetails.pricePerDay}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter price per day"
              required
            />
          </div>

          {/* Car Description */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Car Description
            </label>
            <textarea
              name="description"
              value={carDetails.description}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter car description"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Car Type Dropdown */}
          <div className="relative">
            <label className="block text-lg font-medium text-gray-800">
              Car Type
            </label>
            <select
              name="type"
              value={carDetails.type}
              onChange={handleChange}
              className="w-full max-w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="" disabled>
                Select Car Type
              </option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Sports">Sports</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          {/* Transmission Type Dropdown */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Transmission Type
            </label>
            <select
              name="transmission"
              value={carDetails.transmission}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="" disabled>
                Select Transmission Type
              </option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Fuel Type Dropdown */}
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Fuel Type
            </label>
            <select
              name="fuelType"
              value={carDetails.fuelType}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="" disabled>
                Select Fuel Type
              </option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-pink-700 via-blue-800 to-purple-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Submit to Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
