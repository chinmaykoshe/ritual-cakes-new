import React, { useState } from "react";
import { elements } from "../assets/assets"; // Import elements
import Card from "./Card"; // Import the Card component

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
  const [visibleCount, setVisibleCount] = useState(8); // Initial visible count for small screens
  const [isExpanded, setIsExpanded] = useState(false); // Track if the section is expanded

  // Filter cakes based on the selected category
  const filteredCakes =
    activeCategory === "All Products"
      ? Object.values(elements).flat()
      : elements[categoryMapping[activeCategory]] || [];

  // Sort cakes based on the selected sort order
  const sortedCakes = [...filteredCakes]
    .filter((cake) => {
      if (activeCategory === "Extra Products") {
        // Check if there is any valid price in extraProducts (e.g., "6 pieces", "1 jar")
        return cake.prices && Object.values(cake.prices).some((price) => price > 0);
      }
      // For other products, check if they have a valid "500g" price
      return cake.prices && cake.prices["500g"];
    })
    .sort((a, b) => {
      let priceA = 0;
      let priceB = 0;

      if (activeCategory === "Extra Products") {
        // For extra products, we use the first price (e.g., "6 pieces", "1 jar")
        priceA = Object.values(a.prices)[0] || 0;
        priceB = Object.values(b.prices)[0] || 0;
      } else {
        // For other categories, use the "500g" price
        priceA = a.prices["500g"] || 0;
        priceB = b.prices["500g"] || 0;
      }

      if (sortOrder === "lowToHigh") return priceA - priceB;
      if (sortOrder === "highToLow") return priceB - priceA;
      return 0; // Default to recommended order
    });

  // Function to handle the "Show More" and "Show Less" button click
  const handleToggleVisibility = () => {
    if (isExpanded) {
      setVisibleCount(8); // Reset to initial count when collapsing
    } else {
      const increment = window.innerWidth >= 1024 ? 8 : 6; // 8 for large screens, 6 for small screens
      setVisibleCount((prevCount) => prevCount + increment); // Show more cakes
    }
    setIsExpanded((prev) => !prev); // Toggle the expanded state
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-30 rounded-lg md:px-2 lg:p-8  mt-2 lg:m-top-16 shadow-lg">
      <div className="cakes-page max-w mx-2 md:mx-4 pt-4 pb-4 px- md:px-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4 w-full md:border-r-4 border-customGray ">
            <div className="sticky top-4">
              <h2 className="text-2xl font-bold mb-4 text-black">Browse by:</h2>

              {/* Dropdown for smaller screens */}
              <select
                className="block md:hidden w-full p-2 border border-customGray rounded-lg bg-white text-customGray focus:outline-none focus:ring-2 focus:ring-darkcustombg"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option
                    key={index}
                    value={category}
                    className="text-lg text-black hover:bg-darkcustombg hover:text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>

              {/* Category list for larger screens */}
              <ul className="space-y-4 mb-8 md:block hidden">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`text-lg text-black hover:text-white cursor-pointer px-2 py-1 rounded-lg ${
                      activeCategory === category
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

          {/* Main Content */}
          <div className="md:w-3/4 w-full">
            {/* Header Section */}
            <div className="relative bg-white p-4 md:p-6 rounded-lg mb-6 md:mb-8">
              <h2 className="text-3xl font-bold text-black">{activeCategory}</h2>
              <p className="text-darkcustombg2 mt-2">
                Elevate your experience with our {activeCategory.toLowerCase()} selection.
              </p>
            </div>

            {/* Sort Options */}
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

            {/* Product Grid */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 md:gap-6 ${
                activeCategory === "Extra Products" ? "justify-items-center" : ""
              }`}
            >
              {sortedCakes.slice(0, visibleCount).map((cake) => (
                <Card key={cake.orderID} orderID={cake.orderID} />
              ))}
            </div>

            {/* Show More/Show Less Button */}
            {visibleCount < sortedCakes.length && (
              <div className="flex justify-center mt-4 md:mt-6">
                <button
                  className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
                  onClick={handleToggleVisibility}
                >
                  {isExpanded ? "Show Less" : "Show More"}
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
