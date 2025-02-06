import React from 'react';
import { useNavigate } from 'react-router-dom';
const ManageCars = () => {

    const navigate = useNavigate()
  // Dummy data for the cars managed by the owner
  const cars = [
    {
      id: 1,
      name: 'Tesla Model 3',
      image: 'https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg',
      status: 'Available',
      pricePerDay: '$100',
      bookings: 15,
      lastBooked: '2025-01-10',
      revenue: '$1500',
    },
    {
      id: 2,
      name: 'Ford Mustang',
      image: 'https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg',
      status: 'Rented',
      pricePerDay: '$150',
      bookings: 20,
      lastBooked: '2025-01-12',
      revenue: '$3000',
    },
    {
      id: 3,
      name: 'BMW X5',
      image: 'https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg',
      status: 'Under Maintenance',
      pricePerDay: '$120',
      bookings: 5,
      lastBooked: '2025-01-08',
      revenue: '$600',
    },
  ];

  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Manage Cars</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Image</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Price/Day</th>
                <th className="p-4 border-b">Bookings</th>
                <th className="p-4 border-b">Last Booked</th>
                <th className="p-4 border-b">Revenue</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-100">
                  <td className="p-4 border-b">
                    <img src={car.image} alt={car.name} className="w-16 h-16 rounded" />
                  </td>
                  <td className="p-4 border-b font-semibold">{car.name}</td>
                  <td className="p-4 border-b">
                    <span
                      className={`py-1 px-3 rounded-full text-white text-sm ${
                        car.status === 'Available'
                          ? 'bg-green-500'
                          : car.status === 'Rented'
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td className="p-4 border-b">{car.pricePerDay}</td>
                  <td className="p-4 border-b">{car.bookings}</td>
                  <td className="p-4 border-b">{car.lastBooked}</td>
                  <td className="p-4 border-b">{car.revenue}</td>
                  <td className="p-4 border-b">
                    <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition mr-2">
                      Remove
                    </button>
                    <button className="bg-pink-500 text-white py-1 px-3 rounded hover:bg-pink-600 transition"
                     onClick={()=>navigate(`/upcoming/${car.id}`)}
                     >
                      Upcoming 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCars;
