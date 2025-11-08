import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { elements } from "../assets/assets";

function Card({ orderID }) {
  const navigate = useNavigate();
  const allProducts = Object.values(elements).flat();
  const product = allProducts.find((item) => item.orderID === orderID);
  if (!product) {
    return <div className="text-center text-red-500">Product not found!</div>;
  }
  const handleClick = () => {
    navigate(`/product/${orderID}`);
  };

  return (
    <div
  className="group relative bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl"
  onClick={handleClick}
>
  <div className="relative overflow-hidden rounded-t-2xl">
    <img
      src={product.img}
      alt={product.name}
      onError={e => (e.target.src = elements.fallbackImage)}
      className="w-full h-52 lg:h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute top-3 right-3 bg-darkcustombg2 text-darkcustombg1 text-xs px-4 py-1 rounded-full shadow-md font-bold tracking-widest z-10 select-none group-hover:bg-orange-400 transition-colors duration-200">
      Rs {product.prices["500g"] || product.prices["6 pieces"] || product.prices["1 jar"] || product.prices["1 serving"] || "N/A"}
    </div>
  </div>
  <div className="p-4 text-left">
    <h3 className="text-lg font-bold text-darkcustombg1 mb-1 group-hover:text-orange-600 transition-colors">
      {product.name}
    </h3>
    <p className="text-xs text-gray-500 mb-2">{product.shortDesc || ""}</p>
  </div>
</div>

  );
}

export default Card;