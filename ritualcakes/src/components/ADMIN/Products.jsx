import React, { useState } from 'react';
import { designnames } from '../../designs/designassets';

function Products() {
  const designs = Object.entries(designnames); 
  const [searchQuery, setSearchQuery] = useState("");
  const filteredDesigns = designs.filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const half = Math.ceil(filteredDesigns.length / 2);
  const firstHalf = filteredDesigns.slice(0, half);
  const secondHalf = filteredDesigns.slice(half);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product Designs</h2>
      <input
        type="text"
        placeholder="Search designs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="flex">
        <div className="w-1/2 pr-4">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Design Name</th>
                <th className="border px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {firstHalf.length > 0 ? (
                firstHalf.map(([name, image], index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{name}</td>
                    <td className="border px-4 py-2">
                      <img src={image} alt={name} className="w-[150px] h-full object-cover" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="border px-4 py-2 text-center">No designs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-1/2 pl-4">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Design Name</th>
                <th className="border px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {secondHalf.length > 0 ? (
                secondHalf.map(([name, image], index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{name}</td>
                    <td className="border px-4 py-2">
                      <img src={image} alt={name} className="w-[150px] h-full object-cover" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="border px-4 py-2 text-center">No designs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;
