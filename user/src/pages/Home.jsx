import { React, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/carassets/logo.png"; // Replace with your actual image path
import { FaDollarSign, FaCar, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import axios from "axios";
const Home = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(UserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  console.log("Cars", cars);
  const reviews = [
    {
      rating: 5,
      title: "Seamless Car Rental Experience!",
      content:
        "I recently used this car rental service, and I must say it was an outstanding experience. The website is user-friendly, making it incredibly easy to search for available cars, apply filters, and book the perfect vehicle for my trip. The detailed car descriptions and high-quality images gave me confidence in my choice. The entire process, from browsing to checkout, was smooth and hassle-free.",
      name: "ujjwal",
    },
    {
      rating: 3,
      title: "Affordable and Reliable Service",
      content:
        "What impressed me the most was the affordability and transparency in pricing. There were no hidden charges, and the pricing breakdown was clear before booking. The rental process was quick, and I received instant confirmation along with an email notification. The car I booked was in excellent condition, well-maintained, and clean. This platform ensures that customers get value for their money.",
      name: "Hod",
    },
    {
      rating: 4,
      title: "Highly Recommend for Stress-Free Rentals",
      content:
        "The customer support team was also very responsive and helpful. They promptly answered all my queries, making the experience even more pleasant. The website’s intuitive design, secure payment options, and efficient booking system make it stand out from other rental platforms. I would highly recommend this service to anyone looking for a stress-free and reliable car rental experience! 🚗💨",
      name: "Aditya",
    },
  ];

  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <header
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${logo})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center text-white py-20 px-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Drive Your Dream Car Today
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            Affordable car rentals made easy. Flexible booking options at your
            fingertips.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="bg-pink-600 px-6 py-3 rounded-md hover:bg-blue-700 transition"
              onClick={() => navigate("/cars")}
            >
              Search Cars
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-blue-300 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <FaDollarSign className="text-blue-600 text-4xl mb-4" />
            <h3 className="font-bold text-lg">Affordable Rates</h3>
            <p className="text-gray-600">Best prices guaranteed.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaCar className="text-blue-600 text-4xl mb-4" />
            <h3 className="font-bold text-lg">Wide Selection</h3>
            <p className="text-gray-600">From luxury to economy cars.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaMapMarkerAlt className="text-blue-600 text-4xl mb-4" />
            <h3 className="font-bold text-lg">Seamless Booking</h3>
            <p className="text-gray-600">Fast, easy, and secure.</p>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Popular Cars
        </h2>
        <Slider {...settings}>
          {cars.map((car) => (
            <div
              key={car._id}
              className="border rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={car.images[0]}
                alt={car.name}
                className="w-full h-72 object-cover "
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{car.name}</h3>
                <p className="text-gray-600">₹ {car.pricePerDay}/day</p>
                <button
                  className="mt-4 bg-gradient-to-r sticky top-0 z-50 from-pink-700 via-blue-800 to-purple-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
                  onClick={() => navigate(`/car-details/${car._id}`)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <div className="flex space-x-1">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 text-2xl mb-2" />
                ))}
              </div>
              <h3 className="font-semibold text-lg">{review.title}</h3>
              <p className="text-gray-600 italic mt-2">{review.content}</p>
              <p className="mt-2 font-bold text-right">---{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gray-300 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to hit the road?</h2>
        <p className="mb-6">Book your car today and enjoy the journey!</p>
        <button
          className="bg-white bg-gradient-to-r sticky top-0 z-50 from-pink-700 via-blue-800 to-purple-500 px-6 py-3 rounded-md hover:bg-gray-100 transition"
          onClick={() => navigate("/cars")}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <div className="border-b border-gray-300 mt-4"></div>
      <div className="w-full py-6 px-4 mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
