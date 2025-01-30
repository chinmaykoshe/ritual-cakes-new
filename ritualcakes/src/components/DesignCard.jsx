import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DesignCard = ({ designnames, designKey }) => {
  if (!designnames || !designnames[designKey]) {
    return <div className="text-center text-red-500">Design not available!</div>;
  }
  const designImage = designnames[designKey];
  const displayName = designKey.replace(/_/g, " ");
  const navigate = useNavigate(); 
  const handleCardClick = () => {
    navigate(`/design/${designKey}`);
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 shadow-md rounded-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full h-48 lg:h-[280px] overflow-hidden rounded-lg">
        <motion.img
          src={designImage} 
          alt={`Cake design ${designKey}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-95 rounded-lg"
        />
      </div>
      <div className="p-4 text-left flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black-800 group-hover:font-bold transition-colors duration-300">
          {displayName}
        </h3>
      </div>
    </div>
  );
};

export default DesignCard;
