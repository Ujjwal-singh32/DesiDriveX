import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserContext } from "../context/UserContext";
const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl, userId } = useContext(UserContext);
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom Arrow for seeing the car image
  const CustomPrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-800 bg-white shadow-md rounded-full p-2 cursor-pointer z-10"
    >
      &#8592; {/* Left Arrow */}
    </div>
  );

  const CustomNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-800 bg-white shadow-md rounded-full p-2 cursor-pointer z-10"
    >
      &#8594; {/* Right Arrow */}
    </div>
  );

  // Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  // Function to fetch car details from the API
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        // console.log(carId)
        const response = await fetch(`${backendUrl}/api/cars/details/${carId}`);
        console.log(response.cardata);
        const data = await response.json();
        setCar(data.cardata[0]);
        // console.log(data.cardata)
      } catch (err) {
        setError("Error fetching car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, []);

  // Function to calculate the total price
  const calculateTotalPrice = () => {
    if (startDate && endDate && totalDistance > 0 && car.pricePerDay) {
      const diffInTime = endDate - startDate;
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24)); // Calculate days
      return (
        diffInDays * car.pricePerDay +
        totalDistance * Math.ceil(car.pricePerDay / 0.8765)
      );
    }
    return 100;
  };

  // Function to handle the booking
  const handleBooking = () => {
    // Redirect to the payment page
    navigate(`/payment/${car._id}`, {
      state: {
        car, // Passing car details as well the details required in booking model
        startDate,
        endDate,
        totalDistance,
        totalPrice: calculateTotalPrice().toFixed(2),
      },
    });
  };

  // Function to calculate the distance between two coordinates
  const calculateDistance = (start, end) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.lat - start.lat) * (Math.PI / 180); // Difference in latitude
    const dLng = (end.lng - start.lng) * (Math.PI / 180); // Difference in longitude
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.lat * (Math.PI / 180)) *
        Math.cos(end.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Update total distance when the start or end location is set
  useEffect(() => {
    if (startLocation && endLocation) {
      const distance = calculateDistance(startLocation, endLocation);
      setTotalDistance(distance);
    }
  }, [startLocation, endLocation]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Image Slider */}
        <div className="flex justify-center items-center">
          <Slider {...sliderSettings} className="relative w-full">
            {car.images?.map((image, index) => (
              <div
                key={index}
                className="w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Car Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
          <p className="text-gray-600 mt-4">{car.description}</p>
          <p className="text-lg text-gray-800 mt-4">
            <strong>Type:</strong> {car.type}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Rating:</strong>{" "}
            {car.rating || Math.ceil(Math.random() * 5)} ⭐
          </p>
          <p className="text-lg text-gray-800">
            <strong>Price Per Day:</strong> ${car.pricePerDay}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Price Per Km:</strong> $
            {Math.ceil(car.pricePerDay / 0.8765)}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Model: </strong>
            {car.model}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Car Year: </strong>
            {car.year}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Transmission: </strong>
            {car.transmission}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Fuel Type: </strong>
            {car.fuelType}
          </p>
          <p className="text-lg text-gray-800">
            <strong>Status:</strong>{" "}
            {car.status == "Available" ? (
              <span className="text-green-600">Available</span>
            ) : (
              <span className="text-red-600">Not Available</span>
            )}
          </p>
        </div>
      </div>

      {/* Booking Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Select Booking Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Start Date */}
          <div>
            <label className="text-gray-700 font-medium mb-2 block">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate}
              minDate={new Date()}
              placeholderText="dd/mm/yyyy"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-gray-700 font-medium mb-2 block">
              End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="dd/mm/yyyy"
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Google Maps api */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Route
          </h3>
          <LoadScript googleMapsApiKey="AIzaSyDLk7Tp176K5My0x1kfF3xROZrSfkv7af0">
            <GoogleMap
              mapContainerClassName="h-64 w-full rounded-lg"
              center={startLocation || { lat: 22.7733, lng: 86.1439 }} // Default location
              zoom={10}
              onClick={(e) => {
                if (!startLocation) {
                  setStartLocation({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                } else if (!endLocation) {
                  setEndLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }
              }}
            >
              {startLocation && (
                <Marker position={startLocation} label="Start" />
              )}
              {endLocation && <Marker position={endLocation} label="End" />}
            </GoogleMap>
          </LoadScript>
          {endLocation && (
            <p className="text-gray-700 mt-4">
              Distance: <strong>{totalDistance.toFixed(2)} km</strong>
            </p>
          )}
        </div>

        {/* Total Price */}
        <div className="mt-6">
          <p className="text-lg font-medium text-gray-800">
            Total Price:{" "}
            <span className="text-green-600 font-bold">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </p>
        </div>

        {/* Book Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBooking}
            className="px-6 py-3 bg-gradient-to-r sticky top-0 z-50 from-pink-700 via-blue-800 to-purple-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 cursor-pointer"
            disabled={
              !startDate ||
              !endDate ||
              !car.status == "Available" ||
              !endLocation
            }
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
