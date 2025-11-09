import React from "react";
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
      className="group relative bg-white border border-gray-200 shadow-md rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full h-48 lg:h-[280px] overflow-hidden rounded-lg relative">
        <img
          src={product.img}
          alt={product.name}
          onError={(e) => (e.target.src = elements.fallbackImage)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95 rounded-lg"
        />
        <div className="absolute top-2 right-2 transition-transform duration-300 group-hover:scale-110 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow text-sm font-bold text-gray-800">
          Rs{" "}
          {product.prices["500g"] ||
            product.prices["6 pieces"] ||
            product.prices["1 jar"] ||
            product.prices["1 serving"] ||
            "N/A"}
        </div>
      </div>
      <div className="p-4 text-left">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black group-hover:font-bold transition-colors duration-300">
          {product.name}
        </h3>
      </div>
    </div>
  );
}

export default Card;
