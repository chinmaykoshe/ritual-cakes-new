import React from "react";
import DesignCard from "./Designcard";

const ThemeSection = ({ title, categoryPrefix, designnames, handleZoomIn }) => {
  if (!designnames || typeof designnames !== 'object') {
    // Return a fallback message or empty section if designnames is invalid
    return <div>Error: No designs available</div>;
  }

  // Filter design names by category prefix
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-medium text-brown mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-4">
        {filteredDesignKeys.length > 0 ? (
          filteredDesignKeys.map((designKey) => (
            <DesignCard
              key={designKey}
              designnames={designnames}
              designKey={designKey}
              handleZoomIn={handleZoomIn}
            />
          ))
        ) : (
          <div>No designs available for this category</div>
        )}
      </div>
    </section>
  );
};

export default ThemeSection;
