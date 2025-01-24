import React, { useState } from "react";
import DesignCard from "./DesignCard";

const ThemeSection = ({ title, categoryPrefix, designnames, handleZoomIn }) => {
  // Ensure designnames is an object before proceeding
  if (!designnames || typeof designnames !== 'object') {
    return <div>Error: No designs available</div>;
  }

  // Filter design names by category prefix
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );

  // State to track how many designs to display
  const [visibleDesignsCount, setVisibleDesignsCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false); // Track if the section is expanded

  // Handle "Load More" or "Show Less" functionality
  const handleLoadMore = (e) => {
    e.stopPropagation(); // Prevent event from triggering section click
    if (isExpanded) {
      setVisibleDesignsCount(4); // Reset to 4 designs when collapsed
    } else {
      setVisibleDesignsCount(filteredDesignKeys.length); // Show all designs when expanded
    }
    setIsExpanded((prev) => !prev); // Toggle expanded state
  };

  // Reset section state when clicked (e.g., if switching to another section)
  const handleSectionClick = () => {
    setVisibleDesignsCount(4);  // Reset to 4 designs
    setIsExpanded(false); // Reset to collapsed state
  };

  return (
    <section className="mb-12" onClick={handleSectionClick}> {/* Section click resets state */}
      <h2 className="text-2xl font-medium text-darkcustombg1 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-4">
        {/* Display only the designs based on the visible count */}
        {filteredDesignKeys.slice(0, visibleDesignsCount).map((designKey) => (
          <DesignCard
            key={designKey} // Pass each design key as a unique identifier
            designnames={designnames}
            designKey={designKey}
            handleZoomIn={handleZoomIn}
          />
        ))}
      </div>
      
      {/* Button to toggle between "Load More" and "Show Less" */}
      <div className="mt-4 text-center">
        <button
          className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          onClick={handleLoadMore} // Trigger load more functionality
        >
          {isExpanded ? "Show Less" : "Load More"} {/* Toggle text based on expanded state */}
        </button>
      </div>
    </section>
  );
};

export default ThemeSection;
