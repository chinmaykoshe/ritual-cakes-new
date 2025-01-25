import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { elements } from "../assets/assets";

function Card({ orderID }) {
  const navigate = useNavigate();

  // Flatten all products from the elements object
  const allProducts = Object.values(elements).flat();
  const product = allProducts.find((item) => item.orderID === orderID);

  // Handle case where product is not found
  if (!product) {
    return <div className="text-center text-red-500">Product not found!</div>;
  }

  const handleClick = () => {
    navigate(`/product/${orderID}`);
  };


  return (
    <div
      className="group relative bg-white border border-gray-200 shadow-md rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="w-full h-48 lg:h-[280px] overflow-hidden rounded-lg">
        <img
          src={product.img}
          alt={product.name}
          onError={(e) => (e.target.src = elements.fallbackImage)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95 rounded-lg"
        />
      </div>


      <div className="p-4 text-left flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black-800 group-hover:font-bold transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-gray-800 font-bold">Rs</span>
          <span className="text-gray-800 font-bold">
            {product.prices["500g"] || product.prices["6 pieces"] || product.prices["1 jar"] || product.prices["1 serving"] || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;