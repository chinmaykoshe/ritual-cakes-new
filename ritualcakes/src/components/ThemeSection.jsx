import React, { useState } from "react";
import DesignCard from "./DesignCard";

const ThemeSection = ({ title, categoryPrefix, designnames, handleZoomIn }) => {
  if (!designnames || typeof designnames !== 'object') {
    return <div>Error: No designs available</div>;
  }
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );
  const [visibleDesignsCount, setVisibleDesignsCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleLoadMore = (e) => {
    e.stopPropagation();
    if (isExpanded) {
      setVisibleDesignsCount(4);
    } else {
      setVisibleDesignsCount(filteredDesignKeys.length);
    }
    setIsExpanded((prev) => !prev);
  };
  const handleSectionClick = () => {
    setVisibleDesignsCount(4);
    setIsExpanded(false);
  };

  return (
    <section className="mb-12" onClick={handleSectionClick}>
      <h2 className="text-2xl font-medium text-darkcustombg1 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-4">
        {filteredDesignKeys.slice(0, visibleDesignsCount).map((designKey) => (
          <DesignCard
            key={designKey}
            designnames={designnames}
            designKey={designKey}
            handleZoomIn={handleZoomIn}
          />
        ))}
      </div>
      <div className="mt-4 text-center">
        <button
          className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg border-2 border-transparent 
             hover:text-darkcustombg2 hover:bg-white hover:border-darkcustombg2 transition-all duration-200"
          onClick={handleLoadMore}
        >
          {isExpanded ? "Show Less" : "Load More"}
        </button>
      </div>
    </section>
  );
};

export default ThemeSection;
