import React, { useState } from "react";
import DesignCard from "./DesignCard";

const ThemeSection = ({ title, categoryPrefix, designnames, handleZoomIn }) => {
  if (!designnames || typeof designnames !== 'object') {
    return <div>Error: No designs available</div>;
  }

  // Filter design names by category prefix
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );

  // State to track the number of designs to display
  const [visibleDesignsCount, setVisibleDesignsCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false); // Track if the section is expanded

  const handleLoadMore = (e) => {
    e.stopPropagation(); // Prevent event from triggering section click
    if (isExpanded) {
      setVisibleDesignsCount(4); // Reset to initial 4 designs if already expanded
    } else {
      setVisibleDesignsCount(filteredDesignKeys.length); // Show all designs
    }
    setIsExpanded((prev) => !prev); // Toggle expanded state
  };

  const handleSectionClick = () => {
    setVisibleDesignsCount(4);  // Reset to 4 designs when switching sections
    setIsExpanded(false); // Reset to collapsed state when switching sections
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
      
      {/* Always display the Load More/Show Less button */}
      <div className="mt-4 text-center">
        <button
          className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          onClick={handleLoadMore}
        >
          {isExpanded ? "Show Less" : "Load More"} {/* Toggle button text */}
        </button>
      </div>
    </section>
  );
};

export default ThemeSection;
