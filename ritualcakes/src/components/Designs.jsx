import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { designnames } from "../designs/designassets";
import ThemeSection from "./ThemeSection";  // Import the updated ThemeSection component

// Main Designs Component
const Designs = () => {
  const navigate = useNavigate();

  // Handle carousel image click
  const handleClickDesign = (designImages) => {
    navigate("/pagedesigns", { state: { designImages } });
  };

  // Handle zoom-in functionality
  const handleZoomIn = (designKey) => {
    console.log("Zoom in on:", designKey);  // You can implement the actual zoom-in logic here
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto px-4 py-12 bg-white bg-opacity-30 rounded-lg lg:p-8 lg:m-top-16 shadow-lg">
      {/* Carousel Section */}
      <section className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="lg:w-1/2 flex items-center justify-center">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false} // Hiding dots at the bottom
            infiniteLoop={true}
            useKeyboardArrows={true}
            autoPlay={true}
            interval={2000}
          >
            {Object.values(designnames).map((img, index) => (
              <div
                key={index}
                className="relative h-96"
                onClick={() => handleClickDesign(Object.values(designnames))}
              >
                <img
                  src={img}
                  alt={`Cake design ${index + 1}`}
                  className="object-contain rounded-lg w-full h-full shadow-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="lg:w-1/2 h-full flex flex-col items-center justify-center text-center">
          <p className="text-brown font-montserrat font-bold text-2xl mb-4">
            Click on carousel to see all page designs
          </p>
          <p className="text-brown font-montserrat font-bold text-2xl mb-4">
            View from Our Page
          </p>
          <NavLink
            to="https://www.instagram.com/ritualcakes"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-darkcustombg2 hover:text-darkcustombg2 hover:bg-white text-white py-4 px-8 rounded-lg w-full transform transition duration-300 shadow-xl flex items-center justify-center gap-2"
          >
            <i className="fa fa-instagram text-2xl"></i>
            <span className="font-montserrat font-medium">View</span>
          </NavLink>
        </div>
      </section>

      {/* Theme Sections */}
      <ThemeSection
        title="Engagement Theme"
        categoryPrefix="theme_engagement_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}  // Passing handleZoomIn
      />
      <ThemeSection
        title="Mom Theme"
        categoryPrefix="theme_mom_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Dad Theme"
        categoryPrefix="theme_dad_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Anniversary Theme"
        categoryPrefix="theme_anniversary_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Boy Theme"
        categoryPrefix="theme_boy_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Cute Cake Theme"
        categoryPrefix="theme_cute_cake_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Girl Theme"
        categoryPrefix="theme_girl_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Profession Theme"
        categoryPrefix="theme_profession_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
      <ThemeSection
        title="Retirement Theme"
        categoryPrefix="theme_retirement_design_"
        designnames={designnames}
        handleZoomIn={handleZoomIn}
      />
    </div>
  );
};

export default Designs;
