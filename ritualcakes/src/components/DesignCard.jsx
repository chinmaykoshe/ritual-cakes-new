import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";  // Import useNavigate from React Router

const DesignCard = ({ designnames, designKey }) => {
  // Check if the designnames object or the specified design key is not available
  if (!designnames || !designnames[designKey]) {
    return <div className="text-center text-red-500">Design not available!</div>;
  }

  // Fetch the specific image and its key
  const designImage = designnames[designKey];
  const displayName = designKey.replace(/_/g, " "); // Format the design name

  const navigate = useNavigate();  // Initialize the navigate function

  const handleCardClick = () => {
    // Navigate to the design customization page, passing the designKey as a URL parameter
    navigate(`/design/${designKey}`);
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 shadow-md rounded-lg cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Design Image */}
      <div className="w-full h-48 lg:h-[280px] overflow-hidden rounded-lg">
        <motion.img
          src={designImage} // Use the image from the designnames object
          alt={`Cake design ${designKey}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95 rounded-lg"
        />
      </div>

      {/* Design Details */}
      <div className="p-4 text-left flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black-800 group-hover:font-bold transition-colors duration-300">
          {displayName}
        </h3>
      </div>
    </div>
  );
};

export default DesignCard;
