import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { elements } from '../assets/assets'; // Import elements

const Catalogue = () => {
  const categories = Object.keys(elements);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const scrollToSection = (category) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg px-4 lg:p-8 lg:m-top-16 shadow-lg">

    <div className="  catalogue max-w-7xl mx-auto py-4 px-4 md:px-8 flex flex-col md:flex-row gap-4 md:gap-8">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full border-r-4 border-customGray">
        <div className="sticky top-4">
          <h2 className="text-2xl font-bold mb-4 text-brown">Browse by:</h2>

          {/* Dropdown for smaller screens */}
          <select
            className="block md:hidden w-full p-2 border border-customGray rounded-lg bg-white text-customGray focus:outline-none focus:ring-2 focus:ring-darkcustombg"
            value={activeCategory}
            onChange={(e) => {
              setActiveCategory(e.target.value);
              scrollToSection(e.target.value);
            }}
          >
            {categories.map((category, index) => (
              <option
                key={index}
                value={category}
                className="text-lg text-black hover:bg-white "
              >
                {category.replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>

          {/* Category list for larger screens */}
          <ul className="space-y-4 mb-8 md:block hidden">
            {categories.map((category, index) => (
              <li
                key={index}
                className={`text-lg text-brown hover:text-white cursor-pointer px-2 py-1 rounded-lg ${
                  activeCategory === category
                    ? "text-black font-bold bg-darkcustombg mr-8"
                    : "hover:bg-darkcustombg mr-8"
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  scrollToSection(category);
                }}
              >
                {category.replace(/([A-Z])/g, ' $1')}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {categories.map((category) => (
          <div key={category} id={category} className="mb-12">
            <h1 className="text-3xl font-bold mb-6 text-brown">{category.replace(/([A-Z])/g, ' $1')}</h1>
            <ul className="bg-darkcustombg rounded-lg shadow-lg p-6">
              {elements[category].map((item) => (
                <li
                  key={item.orderID}
                  className="mb-4 p-4 border-b-2 cursor-pointer border-b-brown hover:bg-darkcustombg2 rounded-xl shadow-lg"
                  onClick={() => navigate(`/product/${item.orderID}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <p className="text-xl font-bold text-darkcustomGray">{item.name}</p>
                      <p className="text-sm text-customGray hidden md:block">{item.description}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                    <p className="text-lg font-semibold text-darkcustombg1 text-right">
                      1/2Kg: Rs. {item.prices["500g"]}
                      <span className="hidden md:block"> 1kg: Rs. {item.prices["1kg"]}</span>
                    </p>

                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Catalogue;
