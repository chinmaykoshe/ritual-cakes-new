import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { elements } from "../assets/assets"; 

const SearchBar = ({ showSearchBar, setShowSearchBar }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredNames, setFilteredNames] = useState([]);
  const [filteredDescriptions, setFilteredDescriptions] = useState([]); 

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredNamesResults = getFilteredNames(query);
      const filteredDescriptionsResults = getFilteredDescriptions(query);
      setFilteredNames(filteredNamesResults);
      setFilteredDescriptions(filteredDescriptionsResults);
    } else {
      setFilteredNames([]);
      setFilteredDescriptions([]); 
    }
  };
  const handleItemClick = (orderID) => {
    navigate(`/product/${orderID}`);
    setShowSearchBar(false); 
  };
  const handleCloseSearchBar = () => {
    setShowSearchBar(false);
  };
  const getFilteredNames = (query) => {
    const items = Object.values(elements).flatMap((category) =>
      category.map((product) => ({
        ...product,
        searchableName: product.name.toLowerCase(),
      }))
    );

    return items.filter((product) =>
      product.searchableName.includes(query.toLowerCase())
    );
  };
  const getFilteredDescriptions = (query) => {
    const items = Object.values(elements).flatMap((category) =>
      category.map((product) => ({
        ...product,
        searchableDescription: product.description.toLowerCase(),
      }))
    );

    return items.filter((product) =>
      product.searchableDescription.includes(query.toLowerCase())
    );
  };

  return (
    showSearchBar && (
      <div className="flex justify-center mt-2">
        <div className="fixed w-[300px] sm:w-[500px] p-2 bg-white shadow-md rounded-lg mt-12 z-50">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border-2 border-orange-300 rounded-lg focus:ring focus:ring-blue-500"
            />
            <button
              onClick={handleCloseSearchBar}
              className="text-gray-500 hover:text-gray-800 mx-4 "
            >
              <FaTimes size={28} />
            </button>
          </div>

          {searchQuery && (
            <ul className="mt-2 mx-4">
              {filteredNames.length > 0 && (
                <div>
                  <h3 className="text-gray-600 font-bold mt-4">Product Names:</h3>
                  {filteredNames.map((product, index) => (
                    <li key={index} className="p-2 hover:bg-gray-100">
                      <span
                        onClick={() => handleItemClick(product.orderID)} 
                        className="text-gray-900 hover:text-black cursor-pointer"
                      >
                        {product.name}
                      </span>
                    </li>
                  ))}
                </div>
              )}
              {filteredDescriptions.length > 0 && (
                <div>
                  <h3 className="text-gray-600 font-bold mt-4">Product Descriptions:</h3>
                  {filteredDescriptions.map((product, index) => (
                    <li key={index} className="p-2 hover:bg-gray-100">
                      <span
                        onClick={() => handleItemClick(product.orderID)}
                        className="text-gray-900 hover:text-black cursor-pointer"
                      >
                        {product.description}
                      </span>
                    </li>
                  ))}
                </div>
              )}
              {filteredNames.length === 0 && filteredDescriptions.length === 0 && (
                <li className="p-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>
      </div>
    )
  );
};

export default SearchBar;
