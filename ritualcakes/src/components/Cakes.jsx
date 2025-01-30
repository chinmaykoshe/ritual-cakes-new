import React, { useState, useEffect } from "react";
import { elements } from "../assets/assets"; 
import Card from "./Card"; 

const categoryMapping = {
  "All Products": "all",
  "Ritual's specials": "RitualsSpecials",
  "Extras(specials)": "ExtrasSpecial",
  "Chocolate": "ChocolateCakes",
  "Truffle": "Truffle",
  "Brownie Cakes": "Brownie",
  "More...": "OnlyFlavoured",
  "Real Fruits": "RealFruits",
  "Cheese Cakes": "CheeseCakes",
  "Extra Products": "ExtraProducts",
};
const CakesPage = () => {
  const categories = Object.keys(categoryMapping);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [sortOrder, setSortOrder] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(8); 
  const filteredCakes =
    activeCategory === "All Products"
      ? Object.values(elements).flat()
      : elements[categoryMapping[activeCategory]] || [];
  const sortedCakes = [...filteredCakes]
    .filter((cake) => {
      if (activeCategory === "Extra Products") {
        return cake.prices && Object.values(cake.prices).some((price) => price > 0);
      }
      return cake.prices && cake.prices["500g"];
    })
    .sort((a, b) => {
      let priceA = 0;
      let priceB = 0;
      if (activeCategory === "Extra Products") {
        priceA = Object.values(a.prices)[0] || 0;
        priceB = Object.values(b.prices)[0] || 0;
      } else {
        priceA = a.prices["500g"] || 0;
        priceB = b.prices["500g"] || 0;
      }
      if (sortOrder === "lowToHigh") return priceA - priceB;
      if (sortOrder === "highToLow") return priceB - priceA;
      return 0;
    });
  const handleToggleVisibility = () => {
    const increment = 8; 
    if (visibleCount < sortedCakes.length) {
      setVisibleCount((prevCount) => Math.min(prevCount + increment, sortedCakes.length));
    } else {
      setVisibleCount(8); 
    }
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-30 rounded-lg md:px-2 lg:p-8  mt-2 lg:m-top-16 shadow-lg">
      <div className="cakes-page max-w mx-2 md:mx-4 pt-4 pb-4 px- md:px-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="md:w-1/4 w-full md:border-r-4 border-customGray ">
            <div className="sticky top-4">
              <h2 className="text-2xl font-bold mb-4 text-black">Browse by:</h2>
              <select
                className="block md:hidden w-full p-3 border border-customGray rounded-lg bg-darkcustombg text-customGray focus:outline-none focus:ring-2 focus:ring-darkcustombg focus:ring-offset-2 hover:border-darkcustombg transition-all ease-in-out"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option
                    key={index}
                    value={category}
                    className="text-lg text-black bg-white hover:bg-darkcustombg hover:text-white transition-all ease-in-out"
                  >
                    {category}
                  </option>
                ))}
              </select>
              <ul className="space-y-4 mb-8 md:block hidden">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`text-lg text-black hover:text-white cursor-pointer px-2 py-1 rounded-lg ${activeCategory === category
                      ? "text-black font-bold bg-darkcustombg mr-8"
                      : "hover:bg-darkcustombg mr-8"
                      }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:w-3/4 w-full">
            <div className="relative bg-white p-4 md:p-6 rounded-lg mb-6 md:mb-8">
              <h2 className="text-3xl font-bold text-black">{activeCategory}</h2>
              <p className="text-darkcustombg2 mt-2">
                Elevate your experience with our {activeCategory.toLowerCase()} selection.
              </p>
            </div>
            {activeCategory !== "Extra Products" && (
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center space-x-2">
                  <label htmlFor="sortOrder" className="text-lg font-semibold text-darkcustombg1 mr-2">
                    Sort by:
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border border-customGray rounded-lg p-2 "
                  >
                    <option value="recommended">Recommended</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 md:gap-6 ${activeCategory === "Extra Products" ? "justify-items-center" : ""
                }`}
            >
              {sortedCakes.slice(0, visibleCount).map((cake) => (
                <Card key={cake.orderID} orderID={cake.orderID} />
              ))}
            </div>
            {visibleCount < sortedCakes.length ? (
              <div className="flex justify-center mt-4 md:mt-6">
                <button
                  className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
                  onClick={handleToggleVisibility}
                >
                  Show More
                </button>
              </div>
            ) : (
              <div className="flex justify-center mt-4 md:mt-6">
                <button
                  className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
                  onClick={handleToggleVisibility}
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakesPage;
