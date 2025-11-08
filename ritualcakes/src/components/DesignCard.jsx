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
      className="group relative bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <motion.img
          src={designImage}
          alt={`Cake design ${designKey}`}
          className="w-full h-48 lg:h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 text-left">
        <h3 className="text-lg font-bold text-darkcustombg1 mb-1 group-hover:text-orange-600 transition-colors">
          {displayName}
        </h3>
      </div>
    </div>
  );
};

export default DesignCard;
