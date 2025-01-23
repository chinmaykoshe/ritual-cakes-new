import React, { useState } from 'react';
import { elements } from '../../assets/assets'; // Adjust the path as needed

function CakesAvailable() {
  // Flattening the elements to access all cakes
  const allCakes = Object.values(elements).flat(); // Flattens the elements to get all cakes

  const [searchQuery, setSearchQuery] = useState(""); // To manage search input
  
// Filter cakes based on search query for both name and orderID
const filteredCakes = allCakes.filter((cake) =>
  cake.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Match query case-insensitively for name
  cake.orderID.toLowerCase().includes(searchQuery.toLowerCase()) // Match query case-insensitively for orderID
);


  // Split cakes into two halves
  const half = Math.ceil(filteredCakes.length / 2);
  const firstHalf = filteredCakes.slice(0, half);
  const secondHalf = filteredCakes.slice(half);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Cakes</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search cakes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
        className="mb-4 p-2 border rounded"
      />

      {/* Container for two columns */}
      <div className="flex">
        {/* Left Column */}
        <div className="w-1/2 pr-4">
          <table className="border-collapse w-full">
            <thead className='bg-neutral-100'>
              <tr>
                <th className="border px-4 py-2">Cake Name</th>
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {firstHalf.length > 0 ? (
                firstHalf.map((cake, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{cake.name}</td>
                    <td className="border px-4 py-2">{cake.orderID}</td>
                    <td className="border px-4 py-2">
                      <img src={cake.img} alt={cake.name} className="w-[150px] h-full object-cover" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center">No cakes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="w-1/2 pl-4">
          <table className="border-collapse w-full">
            <thead className='bg-neutral-100'>
              <tr>
                <th className="border px-4 py-2">Cake Name</th>
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {secondHalf.length > 0 ? (
                secondHalf.map((cake, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{cake.name}</td>
                    <td className="border px-4 py-2">{cake.orderID}</td>
                    <td className="border px-4 py-2">
                      <img src={cake.img} alt={cake.name} className="w-[150px] h-full object-cover" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center">No cakes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CakesAvailable;
