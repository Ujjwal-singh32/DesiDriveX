import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // import axios to make API calls
import { UserContext } from "../context/UserContext";
const Cars = () => {
  const { token, setToken, backendUrl } = useContext(UserContext);
  const navigate = useNavigate();
  const [cars, setCars] = useState([]); // State to store the cars fetched from the database
  const [sortOption, setSortOption] = useState("Price");
  const [filterOptions, setFilterOptions] = useState({
    available: false,
    types: {
      SUV: false,
      Sedan: false,
      Sports: false,
      Luxury: false,
    },
  });
  const [pendingFilterOptions, setPendingFilterOptions] = useState(
    filterOptions
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to handle loading status
  const [error, setError] = useState(null); // Error state to handle any errors during fetching

  // Fetch car data from the database when the component mounts
  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Replace the URL with the actual backend URL
        const response = await axios.get(
          `${backendUrl}/api/cars/total-cars-model`
        );
        if (response.data.success) {
          setCars(response.data.cars);
        } else {
          setError("Failed to fetch cars.");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Error fetching cars.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
    const interval = setInterval(fetchCars, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sort the car data based on the selected option
  const sortedCars = cars.sort((a, b) => {
    if (sortOption === "Price") {
      return b.pricePerDay - a.pricePerDay;
    }
    return b.rating - a.rating;
  });

  // Filter the car data based on selected options
  const filteredCars = sortedCars.filter((car) => {
    const isAvailable = pendingFilterOptions.available ? car.available : true;
    const isTypeValid =
      pendingFilterOptions.types[car.type] ||
      Object.values(pendingFilterOptions.types).every((type) => !type);
    return isAvailable && isTypeValid;
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "available") {
      setPendingFilterOptions((prev) => ({ ...prev, [name]: checked }));
    } else {
      setPendingFilterOptions((prev) => ({
        ...prev,
        types: { ...prev.types, [name]: checked },
      }));
    }
  };

  const applyFilters = () => {
    setFilterOptions(pendingFilterOptions);
    setIsFilterOpen(false);
  };

  // If loading, display loading message
  if (loading) {
    return <div>Loading cars...</div>;
  }

  // If there's an error, display error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Car Collections</h1>

      {/* Dropdown for Sort and Filter */}
      <div className="flex justify-end space-x-6 mb-6">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition duration-300"
          >
            <option value="Price">Sort by Price</option>
            <option value="Rating">Sort by Rating</option>
          </select>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 bg-pink-500 text-white rounded-md shadow-md hover:bg-purple-600 transition duration-200"
          >
            Filter By
          </button>

          {/* Filter Dropdown Content */}
          {isFilterOpen && (
            <div className="absolute right-0 bg-white shadow-md rounded-lg mt-2 w-64 p-4">
              <div className="mb-2">
                {/* Available Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={pendingFilterOptions.available}
                    onChange={handleCheckboxChange}
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="available">Available</label>
                </div>
              </div>

              <div>
                {/* Car Types Checkboxes */}
                <div className="flex flex-col">
                  {["SUV", "Sedan", "Sports", "Luxury"].map((type) => (
                    <div key={type} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={type}
                        name={type}
                        checked={pendingFilterOptions.types[type]}
                        onChange={handleCheckboxChange}
                        className="mr-2 cursor-pointer"
                      />
                      <label htmlFor={type}>{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={applyFilters}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
        {filteredCars.map((car) => (
          <div
            key={car._id} // Change to _id if the backend returns MongoDB's _id
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            onClick={() => navigate(`/car-details/${car._id}`)} // Use car._id for navigation
          >
            <img
              src={car.images[0]} // Assuming images is an array in the car object
              alt={car.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{car.name}</h2>
              <p className="text-sm text-gray-500">
                Rating: {car.rating || Math.ceil(5 * Math.random())}⭐
              </p>
              <p className="text-sm text-gray-500">Type: {car.type}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Status:</span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    car.status == "Available" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span>
                  {car.status == "Available" ? "Available" : "Not Available"}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 mt-2">
                Price: {car.pricePerDay}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-b border-gray-300 mt-4"></div>
      <Footer />
    </div>
  );
};

export default Cars;
