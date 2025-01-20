import React from "react";
import { useLocation, Link } from "react-router-dom"; // For accessing state passed through navigation
import { designnames } from "../designs/designassets";
import DesignCard from "./DesignCard";

const ThemeSection = ({ title, categoryPrefix, designnames }) => {
  // Filter design names by category prefix
  const filteredDesignKeys = Object.keys(designnames).filter((key) =>
    key.startsWith(categoryPrefix)
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-medium text-darkcustombg1 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 md:gap-8 gap-4">
        {filteredDesignKeys.map((designKey) => (
          <DesignCard
            key={designKey}
            designnames={designnames}
            designKey={designKey}
          />
        ))}
      </div>
    </section>
  );
};

function PageDesigns() {
  const location = useLocation();
  const { designImages } = location.state || {}; // Get the design images passed from the carousel, if any

  return (
    <div className="max-w-full mx-auto px-4 py-12 md:mx-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/designs" // Assuming "/designs" is your designs list page
          className="text-darkcustombg1 font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
        >
          &larr; Back to All Designs
        </Link>
      </div>

      {/* Pinterest-Style Grid */}
      <section>

        {/* Use the ThemeSection for page_design_* */}
        <ThemeSection
          title="Page Designs"
          categoryPrefix="page_design_"
          designnames={designnames}
        />
      </section>
    </div>
  );
}

export default PageDesigns;
